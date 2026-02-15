import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Grid, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Info } from 'lucide-react';

declare global {
    interface Window {
        katex?: {
            render: (tex: string, element: HTMLElement, options?: Record<string, unknown>) => void;
        };
    }
}

interface LatexProps {
    formula: string;
    display?: boolean;
}

function Latex({ formula, display = false }: LatexProps) {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (containerRef.current && window.katex) {
            window.katex.render(formula, containerRef.current, {
                throwOnError: false,
                displayMode: display,
            });
        }
    }, [formula, display]);

    return (
        <span
            ref={containerRef}
            style={{
                display: display ? 'block' : 'inline-block',
                margin: display ? '16px 0' : '0',
                textAlign: display ? 'center' : 'left',
                overflowX: 'auto',
            }}
        />
    );
}

// --- Types ---
type SceneType = 'manifold' | 'flows' | 'relu';

interface SceneProps {
    isActive: boolean;
}

// --- 1. Manifold Hypothesis Scene ---
const MANIFOLD_POINTS = (() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = Math.sin(x * 0.5) * 0.5 + Math.cos(y * 0.5) * 0.5 + (Math.random() - 0.5) * 0.2;
        points.push(new THREE.Vector3(x, y, z));
    }
    return points;
})();

function ManifoldScene({ isActive }: SceneProps) {
    const planeRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!isActive || !planeRef.current) return;
        planeRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
    });

    if (!isActive) return null;

    return (
        <group>
            <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[12, 12, 32, 32]} />
                <meshStandardMaterial
                    color="#ef4444"
                    transparent
                    opacity={0.2}
                    side={THREE.DoubleSide}
                    wireframe
                />
            </mesh>

            <points rotation={[-Math.PI / 2, 0, 0]}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[new Float32Array(MANIFOLD_POINTS.flatMap(p => [p.x, p.y, p.z])), 3]}
                    />
                </bufferGeometry>
                <pointsMaterial size={0.08} color="#60a5fa" transparent opacity={0.8} />
            </points>
        </group>
    );
}

// --- 2. Normalizing Flows Scene ---
const FLOW_COUNT = 1000;
const FLOW_INITIAL_POSITIONS = (() => {
    const pos: THREE.Vector3[] = [];
    for (let i = 0; i < FLOW_COUNT; i++) {
        const r = 2 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        pos.push(new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        ));
    }
    return pos;
})();

function FlowsScene({ isActive }: SceneProps) {
    const meshRef = useRef<THREE.InstancedMesh>(null);

    const dummy = useMemo(() => new THREE.Vector3(), []);
    const color = useMemo(() => new THREE.Color(), []);
    const matrix = useMemo(() => new THREE.Matrix4(), []);

    useFrame((state) => {
        if (!isActive || !meshRef.current) return;

        const time = state.clock.getElapsedTime();

        for (let i = 0; i < FLOW_COUNT; i++) {
            const base = FLOW_INITIAL_POSITIONS[i];
            const warp = Math.sin(time * 0.5 + base.x) * 0.8 + 1.2;

            dummy.set(
                base.x * warp,
                base.y * (1 / warp) + Math.sin(time + base.z) * 0.5,
                base.z + Math.cos(time * 0.3 + base.y) * 0.5
            );

            matrix.setPosition(dummy);
            meshRef.current.setMatrixAt(i, matrix);

            const density = 1 / warp;
            color.setHSL(0.6 - (density - 0.5) * 0.4, 0.8, 0.5);
            meshRef.current.setColorAt(i, color);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    });

    if (!isActive) return null;

    return (
        <group>
            <Grid infiniteGrid sectionColor="#3b82f6" cellColor="#1e293b" fadeDistance={20} />
            <instancedMesh ref={meshRef} args={[undefined, undefined, FLOW_COUNT]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial />
            </instancedMesh>
        </group>
    );
}

// --- 3. ReLU Scene ---
function ReLUScene({ isActive }: SceneProps) {
    const points = useMemo(() => {
        const p: THREE.Vector3[] = [];
        for (let x = -5; x <= 5; x += 0.1) {
            p.push(new THREE.Vector3(x, Math.max(0, x), 0));
        }
        return p;
    }, []);

    if (!isActive) return null;

    return (
        <group>
            <Grid infiniteGrid sectionColor="#3b82f6" cellColor="#1e293b" fadeDistance={20} />

            <Line
                points={points}
                color="#22c55e"
                lineWidth={5}
            />

            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} />
            </mesh>
        </group>
    );
}

// --- Main Component ---
export default function MeasureTheoryML() {
    const [scene, setScene] = useState<SceneType>('manifold');
    const [katexLoaded, setKatexLoaded] = useState(false);

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
        script.onload = () => setKatexLoaded(true);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(link);
            document.head.removeChild(script);
        };
    }, []);

    const sceneData: Record<SceneType, { title: string; description: string; math: string; color: string }> = {
        manifold: {
            title: "The Manifold Hypothesis",
            description: "Real-world data (like images of faces) occupies strictly zero volume in the high-dimensional pixel space. It lives on a lower-dimensional structure (a manifold). Probability density is singular with respect to the ambient Lebesgue measure.",
            math: "P_{\\text{data}}(x) \\approx 0 \\text{ almost everywhere}",
            color: '#f87171'
        },
        flows: {
            title: "Normalizing Flows",
            description: "To model complex densities, we warp a simple distribution (like a sphere). The change of volume is tracked by the Jacobian Determinant. This factor compensates for the expansion or contraction of space, preserving probability mass.",
            math: "p_x(x) = p_z(z) \\left| \\det \\frac{\\partial z}{\\partial x} \\right|",
            color: '#60a5fa'
        },
        relu: {
            title: "ReLU & Singularity",
            description: "Neural networks use ReLU: f(x) = max(0, x). It is not differentiable at x = 0. However, the set {0} has Lebesgue measure zero. Gradient descent still works because we never hit exactly 0 in floating-point probability.",
            math: "\\lambda(\\{x : f'(x) \\text{ undefined}\\}) = 0",
            color: '#fbbf24'
        }
    };

    const current = sceneData[scene];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#020617', color: '#e2e8f0' }}>

            {/* Header / Controls */}
            <div style={{
                padding: '24px',
                borderBottom: '1px solid #1e293b',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ backgroundColor: '#a855f7', padding: '6px', borderRadius: '6px' }}>
                            <Info size={16} color="white" />
                        </span>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Measure Theory in Machine Learning</h2>
                    </div>
                    <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                        Why &quot;size&quot; and &quot;sets&quot; matter for generative models and deep learning.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    {(['manifold', 'flows', 'relu'] as SceneType[]).map((key) => (
                        <button
                            key={key}
                            onClick={() => setScene(key)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid',
                                borderColor: scene === key ? '#3b82f6' : '#334155',
                                backgroundColor: scene === key ? '#1d4ed8' : '#0f172a',
                                color: scene === key ? 'white' : '#94a3b8',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: 600,
                                transition: 'all 0.2s'
                            }}
                        >
                            {key === 'manifold' ? '1. Manifold' : key === 'flows' ? '2. Flows' : '3. ReLU'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content: 3D + Info */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

                <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <OrbitControls makeDefault enableDamping dampingFactor={0.05} />

                    <ManifoldScene isActive={scene === 'manifold'} />
                    <FlowsScene isActive={scene === 'flows'} />
                    <ReLUScene isActive={scene === 'relu'} />
                </Canvas>

                {/* Overlay Card */}
                <div style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '24px',
                    maxWidth: '400px',
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid #334155',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                }}>
                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: current.color,
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {current.title}
                    </h3>

                    <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#cbd5e1', marginBottom: '16px' }}>
                        {current.description}
                    </p>

                    <div style={{
                        backgroundColor: '#020617',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #1e293b',
                        fontSize: '14px',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        {katexLoaded ? (
                            <Latex formula={current.math} display />
                        ) : (
                            <span style={{ color: '#94a3b8' }}>Loading equation...</span>
                        )}
                    </div>
                </div>

                {/* Legend / Instructions */}
                <div style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    fontSize: '11px',
                    color: '#94a3b8',
                    pointerEvents: 'none'
                }}>
                    DRAG TO ROTATE • SCROLL TO ZOOM
                </div>

            </div>
        </div>
    );
}
