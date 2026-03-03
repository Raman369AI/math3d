import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { useParams } from 'react-router-dom';
import * as THREE from 'three';
import { secureRandom } from '../../utils/secureRandom';
import { SceneContainer } from '../../components/layout/SceneContainer';
import { GlassPane } from '../../components/layout/GlassPane';

function MonteCarloPoints({ onUpdate }: { onUpdate: (inside: number, total: number) => void }) {
    const [points, setPoints] = useState<{ pos: [number, number, number]; inside: boolean }[]>([]);
    const frameCount = useRef(0);
    const insideCount = useRef(0);

    useFrame(() => {
        frameCount.current++;
        if (frameCount.current % 5 === 0 && points.length < 500) {
            const x = (secureRandom() - 0.5) * 4;
            const y = (secureRandom() - 0.5) * 4;
            const z = (secureRandom() - 0.5) * 4;
            const inside = Math.sqrt(x * x + y * y + z * z) <= 2;
            if (inside) insideCount.current++;
            const newPoints = [...points, { pos: [x, y, z] as [number, number, number], inside }];
            setPoints(newPoints);
            onUpdate(insideCount.current, newPoints.length);
        }
    });

    return (
        <>
            {points.map((point, i) => (
                <mesh key={i} position={point.pos}>
                    <sphereGeometry args={[0.04, 8, 8]} />
                    <meshStandardMaterial
                        color={point.inside ? '#fd79a8' : '#333'}
                        emissive={point.inside ? '#fd79a8' : '#111'}
                        emissiveIntensity={point.inside ? 0.5 : 0}
                        transparent
                        opacity={point.inside ? 0.9 : 0.3}
                    />
                </mesh>
            ))}
        </>
    );
}

function BoundingSphere() {
    return (
        <Sphere args={[2, 32, 32]}>
            <meshStandardMaterial
                color="#fd79a8"
                transparent
                opacity={0.05}
                side={THREE.DoubleSide}
                wireframe
            />
        </Sphere>
    );
}

function BoundingBox() {
    return (
        <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(4, 4, 4)]} />
            <lineBasicMaterial color="#333" transparent opacity={0.5} />
        </lineSegments>
    );
}

export default function MonteCarlo() {
    const { topicId } = useParams<{ topicId: string }>();
    const [stats, setStats] = useState({ inside: 0, total: 0 });

    const piEstimate = stats.total > 0 ? (6 * stats.inside) / stats.total : 0;

    const handleUpdate = (inside: number, total: number) => {
        setStats({ inside, total });
    };

    const controls = (
        <GlassPane className="scene-controls" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px', color: 'white', margin: 0 }}>Monte Carlo</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace', margin: '4px 0 0 0' }}>Volume Estimation</p>
            </div>

            <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
                Random points are sampled in a cube. Points inside the sphere are <span style={{ color: '#fd79a8' }}>pink</span>; outside are <span style={{ color: '#555' }}>gray</span>.
            </div>

            {/* Live stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#94a3b8' }}>Total samples</span>
                    <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>{stats.total}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#fd79a8' }}>Inside sphere</span>
                    <span style={{ color: '#fd79a8', fontFamily: 'monospace' }}>{stats.inside}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#94a3b8' }}>Ratio</span>
                    <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>{stats.total > 0 ? (stats.inside / stats.total).toFixed(4) : '—'}</span>
                </div>
            </div>

            {/* π estimate */}
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(253, 121, 168, 0.1)', border: '1px solid rgba(253, 121, 168, 0.2)' }}>
                <div style={{ color: '#fd79a8', fontWeight: 700, fontSize: '14px' }}>
                    π ≈ {stats.total > 0 ? piEstimate.toFixed(4) : '—'}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>
                    Actual π = 3.1416 | Error: {stats.total > 0 ? Math.abs(piEstimate - Math.PI).toFixed(4) : '—'}
                </div>
            </div>

            <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
                V_sphere / V_cube = π/6 → π = 6 × (inside/total)
            </div>
        </GlassPane>
    );

    return (
        <SceneContainer backUrl={`/${topicId || 'probability'}`} controls={controls}>
            <Canvas camera={{ position: [4, 3, 4], fov: 50 }} style={{ width: '100%', height: '100%' }} aria-label="3D Monte Carlo simulation estimating pi by sampling points inside a sphere">
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                <pointLight position={[-3, 2, 3]} intensity={0.5} color="#fd79a8" />
                <BoundingSphere />
                <BoundingBox />
                <MonteCarloPoints onUpdate={handleUpdate} />
                <OrbitControls enableDamping dampingFactor={0.05} />
                <fog attach="fog" args={['#0b0f19', 5, 15]} />
                <color attach="background" args={['#0b0f19']} />
            </Canvas>
        </SceneContainer>
    );
}
