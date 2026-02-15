import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Activity, Info } from 'lucide-react';
import Latex from '../../components/Latex';

interface RiemannSceneProps {
    nPartitions: number;
}

function RiemannScene({ nPartitions }: RiemannSceneProps) {
    const boxesRef = useRef<THREE.Group>(null!);

    const curvePoints = useMemo(() => {
        const points: THREE.Vector3[] = [];
        for (let x = -4; x <= 4; x += 0.1) {
            points.push(new THREE.Vector3(x, Math.sin(x) + 2, 0));
        }
        return points;
    }, []);

    const boxes = useMemo(() => {
        const start = -4;
        const end = 4;
        const dx = (end - start) / nPartitions;
        const boxData: Array<{ position: [number, number, number]; scale: [number, number, number] }> = [];

        for (let i = 0; i < nPartitions; i++) {
            const x = start + i * dx + dx / 2;
            const h = Math.sin(x) + 2;
            boxData.push({
                position: [x, h / 2, 0],
                scale: [dx * 0.9, h, 0.5],
            });
        }
        return boxData;
    }, [nPartitions]);

    useFrame(() => {
        if (boxesRef.current) {
            boxesRef.current.rotation.y += 0.005;
        }
    });

    return (
        <>
            <gridHelper args={[10, 10, 0xcbd5e1, 0xf1f5f9]} />

            {/* Function curve */}
            <line>
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        attach="attributes-position"
                        args={[new Float32Array(curvePoints.flatMap((p) => [p.x, p.y, p.z])), 3]}
                    />
                </bufferGeometry>
                <lineBasicMaterial color={0x3b82f6} linewidth={3} />
            </line>

            {/* Riemann boxes */}
            <group ref={boxesRef}>
                {boxes.map((box, i) => (
                    <mesh key={i} position={box.position} scale={box.scale}>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshPhongMaterial color={0x60a5fa} transparent opacity={0.7} />
                    </mesh>
                ))}
            </group>

            <directionalLight position={[5, 5, 5]} intensity={1} />
            <ambientLight intensity={0.4} />
            <OrbitControls enableDamping dampingFactor={0.05} />
        </>
    );
}

export default function RiemannIntegral() {
    const [riemannN, setRiemannN] = useState(12);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: '#0f172a' }}>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '400px',
                    height: '100%',
                    background: '#0f172a',
                    borderRight: '1px solid #1e293b',
                    color: '#f8fafc',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    overflowY: 'auto',
                    zIndex: 20,
                    padding: '28px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                }}
            >
                <div>
                    <h2
                        style={{
                            fontSize: '24px',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #00cec9, #81ecec)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <Activity size={24} style={{ color: '#00cec9' }} />
                        <span>Riemann Integral</span>
                    </h2>
                    <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
                        Visualizing domain partitioning and the limits of integration
                    </p>
                </div>

                {/* Main explanation */}
                <div
                    style={{
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        padding: '20px',
                    }}
                >
                    <h3
                        style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#00cec9',
                            marginBottom: '12px',
                        }}
                    >
                        Domain Partitioning
                    </h3>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '16px' }}>
                        The Riemann integral chops the <strong>domain</strong> (x-axis) into pieces and sums
                        up rectangles.
                    </p>
                    <div
                        style={{
                            padding: '16px',
                            background: 'rgba(0, 206, 201, 0.1)',
                            borderRadius: '8px',
                            borderLeft: '4px solid #00cec9',
                            fontFamily: 'monospace',
                            fontSize: '15px',
                            textAlign: 'center',
                            overflowX: 'auto',
                        }}
                    >
                        <Latex
                            display
                            formula="\int_a^b f(x) \, dx = \lim_{n \to \infty} \sum_{i=1}^n f(x_i^*) \Delta x"
                        />
                    </div>
                </div>

                {/* Partition control */}
                <div
                    style={{
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        padding: '16px',
                    }}
                >
                    <label
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#94a3b8',
                            marginBottom: '12px',
                        }}
                    >
                        <span>
                            Number of Partitions (<Latex formula="n" />):
                        </span>
                        <span style={{ color: '#00cec9', fontWeight: 700 }}>{riemannN}</span>
                    </label>
                    <input
                        type="range"
                        min="4"
                        max="80"
                        value={riemannN}
                        onChange={(e) => setRiemannN(parseInt(e.target.value))}
                        style={{
                            width: '100%',
                            height: '8px',
                            background: '#334155',
                            borderRadius: '4px',
                            outline: 'none',
                            cursor: 'pointer',
                            accentColor: '#00cec9',
                        }}
                    />
                </div>

                {/* Why it fails */}
                <div
                    style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        padding: '16px',
                    }}
                >
                    <h4
                        style={{
                            fontWeight: 700,
                            fontSize: '14px',
                            color: '#f87171',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <Info size={16} />
                        <span>Why does it fail?</span>
                    </h4>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, fontStyle: 'italic' }}>
                        If a function is too &quot;jagged&quot; (like one that is 1 at rational numbers and 0 at
                        irrationals), your boxes will never stabilize. We need a better way to measure sets.
                    </p>
                </div>

                {/* Legend */}
                <div
                    style={{
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        padding: '16px',
                    }}
                >
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', marginBottom: '12px' }}>
                        Visualization
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                                style={{
                                    width: '24px',
                                    height: '3px',
                                    background: '#3b82f6',
                                    borderRadius: '2px',
                                }}
                            />
                            <span style={{ color: '#cbd5e1' }}>f(x) — The function curve</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                                style={{
                                    width: '24px',
                                    height: '16px',
                                    background: 'rgba(96, 165, 250, 0.7)',
                                    borderRadius: '3px',
                                }}
                            />
                            <span style={{ color: '#cbd5e1' }}>Riemann rectangles</span>
                        </div>
                    </div>
                </div>
            </div>

            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: '400px',
                    right: 0,
                    bottom: 0,
                }}
            >
                <Canvas camera={{ position: [0, 4, 8], fov: 75 }} style={{ width: '100%', height: '100%' }}>
                    <color attach="background" args={['#f8fafc']} />
                    <RiemannScene nPartitions={riemannN} />
                </Canvas>
            </div>
        </div>
    );
}
