import { useState, useMemo, useRef } from 'react';
import Latex from '../../components/Latex';

// --- Types ---

interface DataPoint {
    x: number;
    c: number; // class index: 0, 1, or 2
}

// --- Constants ---

const INITIAL_POINTS: DataPoint[] = [
    { x: 2, c: 0 }, { x: 3, c: 0 }, { x: 4, c: 0 },
    { x: 8, c: 1 }, { x: 9, c: 1 }, { x: 10, c: 1 },
    { x: 14, c: 2 }, { x: 15, c: 2 }, { x: 16, c: 2 },
];

const CLASS_COLORS = [
    {
        line: '#f97316', fill: '#f97316',
        region: 'rgba(249,115,22,0.08)',
        target: '#fdba74', targetFill: 'rgba(254,215,170,0.15)',
    },
    {
        line: '#10b981', fill: '#10b981',
        region: 'rgba(16,185,129,0.08)',
        target: '#6ee7b7', targetFill: 'rgba(167,243,208,0.15)',
    },
    {
        line: '#6366f1', fill: '#6366f1',
        region: 'rgba(99,102,241,0.08)',
        target: '#a5b4fc', targetFill: 'rgba(199,210,254,0.15)',
    },
];

const CLASS_LABELS = ['Orange', 'Green', 'Indigo'];

// --- Chart geometry ---

const W = 800;
const H = 400;
const PAD = 55;
const X_MIN = 0, X_MAX = 18;
const Y_MIN = -0.5, Y_MAX = 1.5;

const mapX = (x: number) => PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - 2 * PAD);
const mapY = (y: number) => H - PAD - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (H - 2 * PAD);
const unmapX = (sx: number) => X_MIN + ((sx - PAD) / (W - 2 * PAD)) * (X_MAX - X_MIN);

// --- Info cards ---

const INFO_CARDS = [
    {
        color: '#f97316',
        bg: 'rgba(249,115,22,0.08)',
        border: 'rgba(249,115,22,0.2)',
        title: '1-of-K Encoding',
        desc: 'Each class k gets a binary target. Class k has t_k = 1; all others 0. The model learns K separate lines.',
        formula: 't_{nk} = \\begin{cases} 1 & c_n = k \\\\ 0 & \\text{otherwise} \\end{cases}',
    },
    {
        color: '#10b981',
        bg: 'rgba(16,185,129,0.08)',
        border: 'rgba(16,185,129,0.2)',
        title: 'Least Squares Solution',
        desc: 'A linear model y_k(x) = w_k x + b_k is fit per class via the closed-form pseudo-inverse.',
        formula: '\\mathbf{W} = (\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T\\mathbf{T}',
    },
    {
        color: '#6366f1',
        bg: 'rgba(99,102,241,0.08)',
        border: 'rgba(99,102,241,0.2)',
        title: 'Decision Rule',
        desc: 'Assign x to the class with the highest linear output. The colored background shows each winning region.',
        formula: 'k^* = \\underset{k}{\\arg\\max}\\; y_k(x)',
    },
];

// --- Component ---

export default function LeastSquaresMulticlass() {
    const [points, setPoints] = useState<DataPoint[]>(INITIAL_POINTS);
    const [selectedClass, setSelectedClass] = useState(1);
    const [showingTargetsFor, setShowingTargetsFor] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // Fit one linear model per class (1-of-K encoding, PRML §4.1.2)
    const models = useMemo(() => {
        if (points.length < 3) return null;

        let sumX = 0, sumX2 = 0;
        const sumT = [0, 0, 0];
        const sumXT = [0, 0, 0];
        const n = points.length;

        points.forEach(p => {
            sumX += p.x;
            sumX2 += p.x * p.x;
            sumT[p.c] += 1;
            sumXT[p.c] += p.x;
        });

        const det = n * sumX2 - sumX * sumX;
        if (Math.abs(det) < 1e-10) return null;

        const inv00 = sumX2 / det;
        const inv01 = -sumX / det;
        const inv10 = -sumX / det;
        const inv11 = n / det;

        return [0, 1, 2].map(k => {
            const b = inv00 * sumT[k] + inv01 * sumXT[k]; // intercept
            const m = inv10 * sumT[k] + inv11 * sumXT[k]; // slope
            return { k, m, b };
        });
    }, [points]);

    // Colour decision regions by argmax of the three linear outputs
    const decisionRegions = useMemo(() => {
        if (!models) return [];
        const steps = 200;
        const stepSize = (X_MAX - X_MIN) / steps;

        return Array.from({ length: steps }, (_, i) => {
            const x1 = X_MIN + i * stepSize;
            const midX = x1 + stepSize / 2;

            let highest = -Infinity, winner = 0;
            models.forEach(m => {
                const val = m.m * midX + m.b;
                if (val > highest) { highest = val; winner = m.k; }
            });

            return { x: x1, width: stepSize, c: winner };
        });
    }, [models]);

    const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const scaleX = W / rect.width;
        const svgX = (e.clientX - rect.left) * scaleX;
        if (svgX < PAD || svgX > W - PAD) return;
        setPoints(prev => [...prev, { x: unmapX(svgX), c: selectedClass }]);
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100%',
            backgroundColor: '#050508', color: '#e2e8f0', overflow: 'hidden',
        }}>

            {/* Header bar */}
            <div style={{
                padding: '14px 24px',
                borderBottom: '1px solid #0f172a',
                display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px',
                flexShrink: 0,
            }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                        1-of-K Least Squares
                    </h2>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                        <Latex formula="\mathbf{W} = (\mathbf{X}^T\mathbf{X})^{-1}\mathbf{X}^T\mathbf{T}" /> — click chart to add points
                    </p>
                </div>

                {/* Add-points class selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Add:
                    </span>
                    {[0, 1, 2].map(k => (
                        <button
                            key={k}
                            onClick={() => setSelectedClass(k)}
                            style={{
                                padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
                                fontSize: '12px', fontWeight: 700, transition: 'all 0.15s',
                                border: `1px solid ${selectedClass === k ? CLASS_COLORS[k].fill : '#1e293b'}`,
                                background: selectedClass === k ? CLASS_COLORS[k].fill : '#0f172a',
                                color: selectedClass === k ? 'white' : '#64748b',
                            }}
                        >
                            {CLASS_LABELS[k]}
                        </button>
                    ))}
                </div>

                {/* Target-view toggle buttons */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    background: '#0f172a', padding: '4px 8px', borderRadius: '10px',
                }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '6px' }}>
                        Target View:
                    </span>
                    {[0, 1, 2].map(k => (
                        <button
                            key={k}
                            onClick={() => setShowingTargetsFor(showingTargetsFor === k ? null : k)}
                            style={{
                                padding: '5px 12px', borderRadius: '6px', border: 'none',
                                cursor: 'pointer', fontSize: '12px', fontWeight: 700, transition: 'all 0.15s',
                                background: showingTargetsFor === k ? CLASS_COLORS[k].fill : 'transparent',
                                color: showingTargetsFor === k ? 'white' : '#64748b',
                            }}
                        >
                            {CLASS_LABELS[k]}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => { setPoints(INITIAL_POINTS); setShowingTargetsFor(null); }}
                    style={{
                        padding: '7px 16px', borderRadius: '8px', border: '1px solid #1e293b',
                        background: '#0f172a', color: '#94a3b8', cursor: 'pointer',
                        fontSize: '12px', fontWeight: 600,
                    }}
                >
                    Reset
                </button>
            </div>

            {/* SVG chart */}
            <div style={{
                flex: 1, overflow: 'hidden', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                padding: '12px 24px 6px', minHeight: 0,
            }}>
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${W} ${H}`}
                    style={{
                        width: '100%', height: '100%', maxHeight: '370px',
                        cursor: 'crosshair', display: 'block',
                        background: '#0b0f19', borderRadius: '10px',
                        border: '1px solid #1e293b',
                    }}
                    onClick={handleSvgClick}
                >
                    {/* Decision region coloring */}
                    {decisionRegions.map((region, i) => (
                        <rect
                            key={i}
                            x={mapX(region.x)}
                            y={mapY(Y_MAX)}
                            width={mapX(region.x + region.width) - mapX(region.x)}
                            height={mapY(Y_MIN) - mapY(Y_MAX)}
                            fill={CLASS_COLORS[region.c].region}
                            opacity={showingTargetsFor !== null ? 0.3 : 1}
                        />
                    ))}

                    {/* Horizontal gridline at y = 1 */}
                    <line
                        x1={mapX(X_MIN)} y1={mapY(1)}
                        x2={mapX(X_MAX)} y2={mapY(1)}
                        stroke="#1e293b" strokeWidth={1} strokeDasharray="4,4"
                    />

                    {/* Axes */}
                    <line x1={mapX(X_MIN)} y1={mapY(0)} x2={mapX(X_MAX)} y2={mapY(0)} stroke="#e2e8f0" strokeWidth={2} />
                    <line x1={mapX(X_MIN)} y1={mapY(Y_MIN)} x2={mapX(X_MIN)} y2={mapY(Y_MAX)} stroke="#e2e8f0" strokeWidth={2} />

                    {/* Y-axis labels */}
                    <text x={mapX(X_MIN) - 10} y={mapY(1)} textAnchor="end" dominantBaseline="middle" fill="#94a3b8" fontSize={13} fontWeight={700}>1.0</text>
                    <text x={mapX(X_MIN) - 10} y={mapY(0)} textAnchor="end" dominantBaseline="middle" fill="#94a3b8" fontSize={13} fontWeight={700}>0.0</text>

                    {/* Axis labels */}
                    <text x={mapX((X_MIN + X_MAX) / 2)} y={H - 8} textAnchor="middle" fill="#64748b" fontSize={12} fontWeight={600}>
                        Input Feature Value (x)
                    </text>
                    <text
                        x={15} y={H / 2} textAnchor="middle"
                        transform={`rotate(-90 15 ${H / 2})`}
                        fill="#64748b" fontSize={12} fontWeight={600}
                    >
                        Predicted / Target
                    </text>

                    {/* Fitted linear model lines */}
                    {models && models.map(model => (
                        <line
                            key={model.k}
                            x1={mapX(X_MIN)} y1={mapY(model.m * X_MIN + model.b)}
                            x2={mapX(X_MAX)} y2={mapY(model.m * X_MAX + model.b)}
                            stroke={CLASS_COLORS[model.k].line}
                            strokeWidth={3.5}
                            opacity={showingTargetsFor !== null && model.k !== showingTargetsFor ? 0.1 : 1}
                        />
                    ))}

                    {/* Data points (plotted at y = -0.1 baseline) */}
                    {points.map((p, i) => (
                        <circle
                            key={i}
                            cx={mapX(p.x)} cy={mapY(-0.1)}
                            r={6}
                            fill={CLASS_COLORS[p.c].fill}
                            stroke="rgba(255,255,255,0.35)"
                            strokeWidth={1.5}
                            opacity={showingTargetsFor !== null ? 0.3 : 1}
                        />
                    ))}

                    {/* Target view overlay: dashed connectors + target circles */}
                    {showingTargetsFor !== null && points.map((p, i) => {
                        const targetY = p.c === showingTargetsFor ? 1 : 0;
                        const col = CLASS_COLORS[showingTargetsFor];
                        return (
                            <g key={`tgt-${i}`}>
                                <line
                                    x1={mapX(p.x)} y1={mapY(-0.1)}
                                    x2={mapX(p.x)} y2={mapY(targetY)}
                                    stroke={col.target}
                                    strokeWidth={1.5}
                                    strokeDasharray="4,4"
                                />
                                <circle
                                    cx={mapX(p.x)} cy={mapY(targetY)}
                                    r={8}
                                    fill={col.targetFill}
                                    stroke={col.fill}
                                    strokeWidth={2.5}
                                />
                            </g>
                        );
                    })}

                    {/* X-axis ticks */}
                    {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18].map(tick => (
                        <g key={tick}>
                            <line
                                x1={mapX(tick)} y1={mapY(0)}
                                x2={mapX(tick)} y2={mapY(0) + 5}
                                stroke="#475569" strokeWidth={1.5}
                            />
                            <text x={mapX(tick)} y={mapY(0) + 20} textAnchor="middle" fill="#64748b" fontSize={11}>
                                {tick}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>

            {/* Info cards */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px', padding: '10px 24px 16px',
                borderTop: '1px solid #0f172a', flexShrink: 0,
            }}>
                {INFO_CARDS.map(card => (
                    <div
                        key={card.title}
                        style={{
                            background: card.bg,
                            border: `1px solid ${card.border}`,
                            borderRadius: '10px', padding: '12px 14px',
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
