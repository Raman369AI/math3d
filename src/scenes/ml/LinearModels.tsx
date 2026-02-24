import { useState, useRef, useEffect, useCallback } from 'react';
import Latex from '../../components/Latex';

// --- Types ---

type AlgoKey = 'logistic' | 'least-squares' | 'perceptron';

interface DataPoint {
    nx: number;
    ny: number;
    t: number; // 1 = C1, 0 = C2
}

// --- Math helpers ---

function sigmoid(a: number): number {
    return 1 / (1 + Math.exp(-a));
}

function solve3x3(A: number[][], B: number[]): number[] {
    const det =
        A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
        A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
        A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);

    const det0 =
        B[0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
        A[0][1] * (B[1] * A[2][2] - A[1][2] * B[2]) +
        A[0][2] * (B[1] * A[2][1] - A[1][1] * B[2]);
    const det1 =
        A[0][0] * (B[1] * A[2][2] - A[1][2] * B[2]) -
        B[0] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
        A[0][2] * (A[1][0] * B[2] - B[1] * A[2][0]);
    const det2 =
        A[0][0] * (A[1][1] * B[2] - B[1] * A[2][1]) -
        A[0][1] * (A[1][0] * B[2] - B[1] * A[2][0]) +
        B[0] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);

    const d = det === 0 ? 1 : det;
    return [det0 / d, det1 / d, det2 / d];
}

function trainLeastSquares(points: DataPoint[]): number[] {
    const XtX: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    const XtT: number[] = [0, 0, 0];

    points.forEach((p) => {
        const x = [1, p.nx, p.ny];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) XtX[i][j] += x[i] * x[j];
            XtT[i] += x[i] * p.t;
        }
    });
    for (let i = 0; i < 3; i++) XtX[i][i] += 0.01;
    return solve3x3(XtX, XtT);
}

function trainLogisticIRLS(points: DataPoint[]): number[] {
    let w = [0, 0, 0];
    for (let iter = 0; iter < 20; iter++) {
        const gradient = [0, 0, 0];
        const Hessian: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        points.forEach((p) => {
            const x = [1, p.nx, p.ny];
            const a = w[0] * x[0] + w[1] * x[1] + w[2] * x[2];
            const y = sigmoid(a);
            const wt = y * (1 - y);
            for (let i = 0; i < 3; i++) {
                gradient[i] += (y - p.t) * x[i];
                for (let j = 0; j < 3; j++) Hessian[i][j] += wt * x[i] * x[j];
            }
        });
        for (let i = 0; i < 3; i++) Hessian[i][i] += 0.1;

        const delta = solve3x3(Hessian, gradient);
        w = [w[0] - delta[0], w[1] - delta[1], w[2] - delta[2]];

        const mag = Math.sqrt(delta[0] ** 2 + delta[1] ** 2 + delta[2] ** 2);
        if (mag < 0.001) break;
    }
    return w;
}

function trainPerceptron(points: DataPoint[]): number[] {
    const w = [0, 0, 0];
    const lr = 0.1;
    for (let iter = 0; iter < 1000; iter++) {
        let errors = 0;
        points.forEach((p) => {
            const target = p.t === 1 ? 1 : -1;
            const a = w[0] + w[1] * p.nx + w[2] * p.ny;
            if (a * target <= 0) {
                w[0] += lr * target;
                w[1] += lr * target * p.nx;
                w[2] += lr * target * p.ny;
                errors++;
            }
        });
        if (errors === 0) break;
    }
    return w;
}

function train(points: DataPoint[], algo: AlgoKey): number[] {
    if (points.length < 2) return [0, 0, 0];
    if (algo === 'least-squares') return trainLeastSquares(points);
    if (algo === 'logistic') return trainLogisticIRLS(points);
    return trainPerceptron(points);
}

// --- Canvas drawing ---

function drawScene(
    canvas: HTMLCanvasElement,
    points: DataPoint[],
    weights: number[],
    algo: AlgoKey,
) {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width / dpr * dpr, canvas.height / dpr * dpr);

    const normX = (px: number) => (px / w) * 2 - 1;
    const normY = (py: number) => (py / h) * 2 - 1;
    const fromNX = (nx: number) => ((nx + 1) / 2) * w;
    const fromNY = (ny: number) => ((ny + 1) / 2) * h;

    // Background region shading
    if (points.length > 0) {
        const step = 8;
        for (let i = 0; i < w; i += step) {
            for (let j = 0; j < h; j += step) {
                const nx = normX(i);
                const ny = normY(j);
                const a = weights[0] + weights[1] * nx + weights[2] * ny;

                let color: string;
                if (algo === 'logistic') {
                    const p = sigmoid(a);
                    const alpha = Math.abs(p - 0.5) * 0.55;
                    color = p > 0.5
                        ? `rgba(59,130,246,${alpha})`
                        : `rgba(239,68,68,${alpha})`;
                } else if (algo === 'least-squares') {
                    color = a > 0.5
                        ? 'rgba(59,130,246,0.10)'
                        : 'rgba(239,68,68,0.10)';
                } else {
                    color = a > 0
                        ? 'rgba(59,130,246,0.10)'
                        : 'rgba(239,68,68,0.10)';
                }
                ctx.fillStyle = color;
                ctx.fillRect(i, j, step, step);
            }
        }
    }

    // Decision boundary line
    if (points.length > 1 && (weights[1] !== 0 || weights[2] !== 0)) {
        const offset = algo === 'least-squares' ? 0.5 : 0;
        const nx1 = -1.1;
        const ny1 = (offset - weights[0] - weights[1] * nx1) / weights[2];
        const nx2 = 1.1;
        const ny2 = (offset - weights[0] - weights[1] * nx2) / weights[2];

        ctx.beginPath();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = 'rgba(226,232,240,0.4)';
        ctx.shadowBlur = 6;
        ctx.moveTo(fromNX(nx1), fromNY(ny1));
        ctx.lineTo(fromNX(nx2), fromNY(ny2));
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    // Data points
    points.forEach((p) => {
        const x = fromNX(p.nx);
        const y = fromNY(p.ny);
        const fillColor = p.t === 1 ? '#3b82f6' : '#ef4444';
        const glowColor = p.t === 1 ? 'rgba(59,130,246,0.5)' : 'rgba(239,68,68,0.5)';

        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = glowColor;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    });

    if (points.length === 0) {
        ctx.fillStyle = '#475569';
        ctx.font = '500 15px system-ui,sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Click or tap to add training data', w / 2, h / 2);
    }
}

// --- Info cards data ---

const INFO_CARDS = [
    {
        color: '#3b82f6',
        bg: 'rgba(59,130,246,0.08)',
        border: 'rgba(59,130,246,0.2)',
        title: 'Activation Function',
        desc: 'Logistic regression uses the sigmoid to map the linear predictor to a probability in (0, 1).',
        formula: 'f(a) = \\sigma(a) = \\tfrac{1}{1+e^{-a}}',
    },
    {
        color: '#94a3b8',
        bg: 'rgba(148,163,184,0.06)',
        border: 'rgba(148,163,184,0.15)',
        title: 'Decision Surface',
        desc: 'Boundaries occur where the linear predictor equals a threshold value.',
        formula: 'w_1 x_1 + w_2 x_2 + w_0 = 0',
    },
    {
        color: '#ef4444',
        bg: 'rgba(239,68,68,0.08)',
        border: 'rgba(239,68,68,0.2)',
        title: 'Least Squares Masking',
        desc: 'Unlike Logistic, LS penalises high-confidence correct predictions — outliers can "drag" the boundary.',
        formula: '\\mathbf{w} = (\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T\\mathbf{t}',
    },
];

// --- Style helpers ---

const BTN_BASE: React.CSSProperties = {
    padding: '8px 18px',
    borderRadius: '8px',
    border: '1px solid',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 700,
    transition: 'all 0.15s',
};

// --- Main Component ---

export default function LinearModels() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [points, setPoints] = useState<DataPoint[]>([]);
    const [weights, setWeights] = useState<number[]>([0, 0, 0]);
    const [algo, setAlgo] = useState<AlgoKey>('logistic');
    const [currentClass, setCurrentClass] = useState<number>(1);

    // Resize canvas to match display size with DPR
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const observer = new ResizeObserver(() => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.scale(dpr, dpr);
        });
        observer.observe(canvas);
        return () => observer.disconnect();
    }, []);

    // Redraw whenever state changes
    useEffect(() => {
        if (canvasRef.current) {
            drawScene(canvasRef.current, points, weights, algo);
        }
    }, [points, weights, algo]);

    const retrain = useCallback((pts: DataPoint[], currentAlgo: AlgoKey) => {
        const w = train(pts, currentAlgo);
        setWeights(w);
    }, []);

    const handleAlgoChange = useCallback((value: AlgoKey) => {
        setAlgo(value);
        retrain(points, value);
    }, [points, retrain]);

    const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        const newPoints = [...points, { nx, ny, t: currentClass }];
        setPoints(newPoints);
        retrain(newPoints, algo);
    }, [points, currentClass, algo, retrain]);

    const handleClear = useCallback(() => {
        setPoints([]);
        setWeights([0, 0, 0]);
    }, []);

    const handleRandom = useCallback(() => {
        const newPoints: DataPoint[] = [];
        for (let i = 0; i < 12; i++) {
            newPoints.push({ nx: Math.random() * 0.6 - 0.7, ny: Math.random() * 0.6 - 0.7, t: 1 });
            newPoints.push({ nx: Math.random() * 0.6 + 0.1, ny: Math.random() * 0.6 + 0.1, t: 0 });
        }
        setPoints(newPoints);
        retrain(newPoints, algo);
    }, [algo, retrain]);

    const c1Active = currentClass === 1;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#050508', color: '#e2e8f0', overflow: 'hidden' }}>

            {/* Header bar */}
            <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid #0f172a',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '16px',
                flexShrink: 0,
            }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Linear Models for Classification</h2>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                        <Latex formula="y(\mathbf{x}) = f(\mathbf{w}^T\mathbf{x} + w_0)" /> — click the canvas to place points
                    </p>
                </div>

                {/* Class selector */}
                <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                        style={{
                            ...BTN_BASE,
                            background: c1Active ? '#2563eb' : '#0f172a',
                            borderColor: c1Active ? '#3b82f6' : '#1e293b',
                            color: c1Active ? 'white' : '#64748b',
                            boxShadow: c1Active ? '0 0 12px rgba(59,130,246,0.4)' : 'none',
                        }}
                        onClick={() => setCurrentClass(1)}
                    >
                        C₁ (t=1)
                    </button>
                    <button
                        style={{
                            ...BTN_BASE,
                            background: !c1Active ? '#be123c' : '#0f172a',
                            borderColor: !c1Active ? '#ef4444' : '#1e293b',
                            color: !c1Active ? 'white' : '#64748b',
                            boxShadow: !c1Active ? '0 0 12px rgba(239,68,68,0.4)' : 'none',
                        }}
                        onClick={() => setCurrentClass(0)}
                    >
                        C₂ (t=0)
                    </button>
                </div>

                {/* Algorithm selector */}
                <select
                    value={algo}
                    onChange={(e) => handleAlgoChange(e.target.value as AlgoKey)}
                    style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #1e293b',
                        background: '#0f172a',
                        color: '#e2e8f0',
                        fontSize: '13px',
                        cursor: 'pointer',
                        outline: 'none',
                    }}
                >
                    <option value="logistic">Logistic Regression (IRLS)</option>
                    <option value="least-squares">Least Squares</option>
                    <option value="perceptron">Perceptron</option>
                </select>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                        style={{ ...BTN_BASE, background: '#0f172a', borderColor: '#1e293b', color: '#94a3b8' }}
                        onClick={handleRandom}
                    >
                        Random
                    </button>
                    <button
                        style={{ ...BTN_BASE, background: '#0f172a', borderColor: '#1e293b', color: '#94a3b8' }}
                        onClick={handleClear}
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Canvas + stats row */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

                {/* Canvas */}
                <div style={{ flex: 1, position: 'relative' }}>
                    <canvas
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        style={{ width: '100%', height: '100%', cursor: 'crosshair', display: 'block' }}
                    />

                    {/* Legend overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: 'rgba(15,23,42,0.85)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid #1e293b',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        fontSize: '12px',
                        pointerEvents: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }} />
                            <span style={{ color: '#94a3b8' }}>Class C₁ (t=1)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
                            <span style={{ color: '#94a3b8' }}>Class C₂ (t=0)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: 20, height: 2, background: '#e2e8f0' }} />
                            <span style={{ color: '#94a3b8' }}>Decision boundary</span>
                        </div>
                    </div>
                </div>

                {/* Stats sidebar */}
                <div style={{
                    width: '180px',
                    flexShrink: 0,
                    borderLeft: '1px solid #0f172a',
                    background: 'rgba(15,23,42,0.5)',
                    padding: '20px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                }}>
                    <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginBottom: '10px' }}>
                            Model Weights
                        </div>
                        {[
                            { label: 'w₀ (bias)', val: weights[0] },
                            { label: 'w₁', val: weights[1] },
                            { label: 'w₂', val: weights[2] },
                        ].map(({ label, val }) => (
                            <div key={label} style={{ marginBottom: '8px' }}>
                                <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px' }}>{label}</div>
                                <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#60a5fa' }}>
                                    {val.toFixed(4)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: '1px solid #0f172a', paddingTop: '16px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginBottom: '8px' }}>
                            Dataset
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            <div>Total: <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{points.length}</span></div>
                            <div>C₁: <span style={{ color: '#3b82f6', fontFamily: 'monospace' }}>{points.filter(p => p.t === 1).length}</span></div>
                            <div>C₂: <span style={{ color: '#ef4444', fontFamily: 'monospace' }}>{points.filter(p => p.t === 0).length}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                padding: '12px 20px 16px',
                borderTop: '1px solid #0f172a',
                flexShrink: 0,
            }}>
                {INFO_CARDS.map((card) => (
                    <div
                        key={card.title}
                        style={{
                            background: card.bg,
                            border: `1px solid ${card.border}`,
                            borderRadius: '10px',
                            padding: '12px 14px',
                        }}
                    >
                        <div style={{ fontSize: '12px', fontWeight: 700, color: card.color, marginBottom: '4px' }}>
                            {card.title}
                        </div>
                        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 6px', lineHeight: 1.5 }}>
                            {card.desc}
                        </p>
                        <div style={{ fontSize: '11px', background: 'rgba(0,0,0,0.25)', borderRadius: '6px', padding: '4px 8px', textAlign: 'center' }}>
                            <Latex formula={card.formula} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
