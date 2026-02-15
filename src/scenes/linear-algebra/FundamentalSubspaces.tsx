import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Arrow } from '../../components/3d/Arrow';
import { Label } from '../../components/3d/Label';
import { SubspacePlane, SubspaceLine } from '../../components/3d/Subspace';

/* ========== Data ========== */
const DATA = {
    x: [3, 3, 3] as [number, number, number],
    x_row: [1, 4, 2] as [number, number, number],
    x_null: [2, -1, 1] as [number, number, number],
    b: [9, 6, 15] as [number, number, number],
    rowNormal: [2, -1, 1] as [number, number, number],
    colNormal: [-1, -1, 1] as [number, number, number],
    c1: [1, 0, 1] as [number, number, number],
    c2: [2, 1, 3] as [number, number, number],
};

type ViewMode = 'domain' | 'codomain';

/* ========== Domain Scene ========== */
function DomainView() {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.15;
    });

    return (
        <group ref={groupRef}>
            {/* Row Space plane (green) */}
            <SubspacePlane normal={DATA.rowNormal} color="#10b981" />
            <Label text="Row Space C(Aᵀ)" position={[4, 6, 0]} color="#34d399" />

            {/* Null Space line (red) */}
            <SubspaceLine direction={DATA.rowNormal} color="#ef4444" />
            <Label text="Null Space N(A)" position={[4, -3, 3]} color="#f87171" />

            {/* Input vector x (yellow, thick) */}
            <Arrow direction={DATA.x} color="#eab308" thickness={0.12} />
            <Label text="x = [3,3,3]" position={[3.5, 3.5, 3]} color="#facc15" />

            {/* x_row (light green) */}
            <Arrow direction={DATA.x_row} color="#86efac" thickness={0.06} />
            <Label text="x_r = [1,4,2]" position={[1, 5, 2]} color="#86efac" />

            {/* x_null (light red) */}
            <Arrow direction={DATA.x_null} color="#fca5a5" thickness={0.06} />
            <Label text="x_n = [2,-1,1]" position={[3, -1.5, 1]} color="#fca5a5" />

            {/* Dashed addition: x_null from tip of x_row to show x = x_r + x_n */}
            <Arrow direction={DATA.x_null} color="#64748b" origin={DATA.x_row} thickness={0.03} />

            {/* Orthogonality indicator */}
            <Label text="⊥" position={[1.5, 0.5, 1.5]} color="#94a3b8" />
        </group>
    );
}

/* ========== Codomain Scene ========== */
function CodomainView() {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.15;
    });

    return (
        <group ref={groupRef}>
            {/* Column Space plane (blue) */}
            <SubspacePlane normal={DATA.colNormal} color="#3b82f6" />
            <Label text="Column Space C(A)" position={[6, -4, 4]} color="#60a5fa" />

            {/* Left Null Space line (orange) */}
            <SubspaceLine direction={DATA.colNormal} color="#f97316" />
            <Label text="Left Null Space N(Aᵀ)" position={[-4, -5, 5]} color="#fb923c" />

            {/* Column vectors c1, c2 (cyan) */}
            <Arrow direction={DATA.c1} color="#22d3ee" thickness={0.06} />
            <Label text="c₁ = [1,0,1]" position={[1, 1, 1]} color="#67e8f9" />

            <Arrow direction={DATA.c2} color="#22d3ee" thickness={0.06} />
            <Label text="c₂ = [2,1,3]" position={[2, 2, 3]} color="#67e8f9" />

            {/* Output vector b (fuchsia, thick) */}
            <Arrow direction={DATA.b} color="#d946ef" thickness={0.15} />
            <Label text="b = Ax = [9,6,15]" position={[10, 7, 16]} color="#e879f9" />

            {/* Show b as combination of columns */}
            <Label text="b = 3c₁ + 3c₂" position={[5, -1, 8]} color="#a78bfa" />
        </group>
    );
}

/* ========== Shared Scene Elements ========== */
function SceneBase() {
    return (
        <>
            <ambientLight intensity={0.7} />
            <directionalLight position={[15, 25, 15]} intensity={0.5} />
            <axesHelper args={[12]} />
            <gridHelper args={[30, 30, '#334155', '#1e293b']} position={[0, -0.01, 0]} />
            <fog attach="fog" args={['#0f172a', 20, 60]} />
        </>
    );
}

/* ========== Info Panel (Sidebar Inside the Component) ========== */
function InfoPanel({
    mode,
    onModeChange,
}: {
    mode: ViewMode;
    onModeChange: (m: ViewMode) => void;
}) {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '360px',
            height: '100%',
            background: '#0f172a', /* Solid opaque background */
            borderRight: '1px solid #1e293b',
            color: '#f8fafc',
            fontFamily: 'Inter, system-ui, sans-serif',
            overflowY: 'auto',
            zIndex: 20,
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
        }}>
            {/* Title */}
            <div>
                <h2 style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #818cf8, #34d399)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '6px',
                }}>
                    Fundamental Subspaces
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
                    Every m×n matrix A defines 4 fundamental subspaces that come in two orthogonal pairs,
                    splitting the domain and codomain completely.
                </p>
            </div>

            {/* Matrix display */}
            <div style={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '14px',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Matrix A</div>
                    <div style={{ color: '#fff', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px 10px', border: '2px solid #475569', borderRight: 'none', borderLeft: 'none', padding: '4px 8px', borderLeftStyle: 'solid', borderRightStyle: 'solid' }}>
                        <span>1</span><span>2</span><span>0</span>
                        <span>0</span><span>1</span><span>1</span>
                        <span>1</span><span>3</span><span>1</span>
                    </div>
                </div>
                <span style={{ color: '#475569', fontWeight: 700, fontSize: '18px' }}>·</span>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>x</div>
                    <div style={{ color: '#facc15', display: 'grid', gridTemplateColumns: '1fr', gap: '2px', border: '2px solid #475569', padding: '4px 8px' }}>
                        <span>3</span><span>3</span><span>3</span>
                    </div>
                </div>
                <span style={{ color: '#475569', fontWeight: 700, fontSize: '18px' }}>=</span>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>b</div>
                    <div style={{ color: '#e879f9', display: 'grid', gridTemplateColumns: '1fr', gap: '2px', border: '2px solid #475569', padding: '4px 8px' }}>
                        <span>9</span><span>6</span><span>15</span>
                    </div>
                </div>
            </div>

            {/* Mode toggle */}
            <div style={{
                display: 'flex',
                gap: '4px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '4px',
            }}>
                <button
                    onClick={() => onModeChange('domain')}
                    style={{
                        flex: 1,
                        padding: '8px 0',
                        fontSize: '13px',
                        fontWeight: 600,
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: mode === 'domain' ? '#4f46e5' : 'transparent',
                        color: mode === 'domain' ? '#fff' : '#94a3b8',
                    }}
                >
                    Domain (ℝ³)
                </button>
                <button
                    onClick={() => onModeChange('codomain')}
                    style={{
                        flex: 1,
                        padding: '8px 0',
                        fontSize: '13px',
                        fontWeight: 600,
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: mode === 'codomain' ? '#c026d3' : 'transparent',
                        color: mode === 'codomain' ? '#fff' : '#94a3b8',
                    }}
                >
                    Codomain (ℝ³)
                </button>
            </div>

            {/* Explanations */}
            {mode === 'domain' ? <DomainExplanation /> : <CodomainExplanation />}

            {/* Key Insight */}
            <div style={{
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                padding: '14px',
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#a5b4fc', marginBottom: '6px' }}>
                    💡 Key Insight — The Fundamental Theorem
                </h4>
                <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                    For any matrix A of rank r with n columns and m rows:
                </p>
                <ul style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.8, margin: '8px 0 0', paddingLeft: '16px' }}>
                    <li><strong style={{ color: '#34d399' }}>Row Space</strong> has dimension <strong>r</strong> in ℝⁿ</li>
                    <li><strong style={{ color: '#f87171' }}>Null Space</strong> has dimension <strong>n − r</strong> in ℝⁿ</li>
                    <li><strong style={{ color: '#60a5fa' }}>Column Space</strong> has dimension <strong>r</strong> in ℝᵐ</li>
                    <li><strong style={{ color: '#fb923c' }}>Left Null Space</strong> has dimension <strong>m − r</strong> in ℝᵐ</li>
                </ul>
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6, margin: '8px 0 0', fontStyle: 'italic' }}>
                    This matrix has rank 2, so Row Space &amp; Column Space are 2D planes and Null Space &amp; Left Null Space are 1D lines.
                </p>
            </div>

            {/* Dimension formula */}
            <div style={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '14px',
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>
                    📐 Dimension Counts (Rank-Nullity)
                </h4>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', color: '#94a3b8', lineHeight: 1.8 }}>
                    <div>dim(C(Aᵀ)) + dim(N(A)) = n</div>
                    <div style={{ color: '#64748b', paddingLeft: '12px' }}>→ 2 + 1 = 3 ✓</div>
                    <div style={{ marginTop: '4px' }}>dim(C(A)) + dim(N(Aᵀ)) = m</div>
                    <div style={{ color: '#64748b', paddingLeft: '12px' }}>→ 2 + 1 = 3 ✓</div>
                </div>
            </div>
        </div>
    );
}

function DomainExplanation() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ExplanationCard
                color="#10b981"
                borderColor="rgba(16,185,129,0.3)"
                bgColor="rgba(6,78,59,0.2)"
                title="Row Space C(Aᵀ)"
                description="A 2D plane spanned by the rows of A. It contains every vector that A can distinguish — two different vectors in the row space always produce different outputs."
            />
            <ExplanationCard
                color="#ef4444"
                borderColor="rgba(239,68,68,0.3)"
                bgColor="rgba(127,29,29,0.2)"
                title="Null Space N(A)"
                description="A 1D line orthogonal to the Row Space. Any vector on this line is 'invisible' to A — it maps to zero. Moving along the null space doesn't change Ax."
            />
            <ExplanationCard
                color="#eab308"
                borderColor="rgba(234,179,8,0.3)"
                bgColor="rgba(113,63,18,0.2)"
                title="Vector Decomposition: x = x_r + x_n"
                description="The input x splits uniquely into its row-space component x_r = [1,4,2] and its null-space component x_n = [2,-1,1]. Only x_r matters for the output: Ax = A·x_r."
            />
        </div>
    );
}

function CodomainExplanation() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ExplanationCard
                color="#3b82f6"
                borderColor="rgba(59,130,246,0.3)"
                bgColor="rgba(29,78,216,0.15)"
                title="Column Space C(A)"
                description="A 2D plane spanned by A's columns. It is the set of all reachable outputs — if b is in C(A), then Ax = b has a solution."
            />
            <ExplanationCard
                color="#f97316"
                borderColor="rgba(249,115,22,0.3)"
                bgColor="rgba(154,52,18,0.15)"
                title="Left Null Space N(Aᵀ)"
                description="A 1D line orthogonal to the Column Space. Vectors here are unreachable — no input x can produce an output in this direction."
            />
            <ExplanationCard
                color="#d946ef"
                borderColor="rgba(217,70,239,0.3)"
                bgColor="rgba(134,25,143,0.15)"
                title="Output b Lands on Column Space"
                description="b = [9,6,15] lies exactly in the column space because b = 3·c₁ + 3·c₂. This confirms Ax = b has a solution — and there's a family of solutions differing by null space vectors."
            />
        </div>
    );
}

function ExplanationCard({
    color,
    borderColor,
    bgColor,
    title,
    description,
}: {
    color: string;
    borderColor: string;
    bgColor: string;
    title: string;
    description: string;
}) {
    return (
        <div style={{
            background: bgColor,
            border: `1px solid ${borderColor}`,
            borderRadius: '12px',
            padding: '14px',
        }}>
            <h4 style={{
                fontSize: '13px',
                fontWeight: 700,
                color,
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            }}>
                <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: color,
                    display: 'inline-block',
                    flexShrink: 0,
                }} />
                {title}
            </h4>
            <p style={{
                fontSize: '12px',
                color: '#cbd5e1',
                lineHeight: 1.6,
                margin: 0,
            }}>
                {description}
            </p>
        </div>
    );
}

/* ========== Main Component ========== */
export default function FundamentalSubspaces() {
    const [mode, setMode] = useState<ViewMode>('domain');

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: '#0f172a' }}>
            <Canvas
                camera={{ position: [20, 14, 20], fov: 45 }}
                style={{ width: '100%', height: '100%' }}
                dpr={[1, 1.5]}
                gl={{ powerPreference: 'default', antialias: true }}
                aria-label="Fundamental Subspaces Visualization"
                onCreated={({ gl }) => {
                    const canvas = gl.domElement;
                    canvas.addEventListener('webglcontextlost', (e) => {
                        e.preventDefault();
                        console.warn('WebGL context lost - attempting to restore');
                    });
                    canvas.addEventListener('webglcontextrestored', () => {
                        console.log('WebGL context restored');
                        gl.setSize(canvas.clientWidth, canvas.clientHeight);
                    });
                }}
            >
                <SceneBase />
                {mode === 'domain' ? <DomainView /> : <CodomainView />}
                <OrbitControls enableDamping dampingFactor={0.05} />
            </Canvas>

            {/* Info panel overlay */}
            <InfoPanel mode={mode} onModeChange={setMode} />

            {/* Space badge */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                padding: '8px 18px',
                borderRadius: '100px',
                background: mode === 'domain' ? '#312e81' : '#701a75', /* Solid opaque background */
                border: `1px solid ${mode === 'domain' ? '#4f46e5' : '#c026d3'}`,
                color: mode === 'domain' ? '#c7d2fe' : '#f5d0fe',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                fontFamily: 'Inter, sans-serif',
            }}>
                {mode === 'domain' ? 'Domain View (ℝ³)' : 'Codomain View (ℝ³)'}
            </div>
        </div>
    );
}
