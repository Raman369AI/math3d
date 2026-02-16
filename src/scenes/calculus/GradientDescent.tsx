import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RefreshCcw } from 'lucide-react';
import { SceneContainer } from '../../components/layout/SceneContainer';
import { GlassPane } from '../../components/layout/GlassPane';
import { useParams } from 'react-router-dom';

function calculateLoss(x: number, y: number) {
    return 0.5 * (x * x + y * y); // Simple quadratic loss
}

// --- Scene Components ---

function LossSurface() {
    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(8, 8, 64, 64);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = calculateLoss(x, y); // Map loss to Z (up)
            pos.setZ(i, z);
        }
        geo.computeVertexNormals();
        return geo;
    }, []);

    return (
        <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh geometry={geometry}>
                <meshStandardMaterial
                    color="#00cec9"
                    roughness={0.4}
                    metalness={0.5}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.6}
                />
            </mesh>
            <mesh geometry={geometry}>
                <meshBasicMaterial color="#00cec9" wireframe transparent opacity={0.1} />
            </mesh>
        </group>
    );
}

function DescentBall({ isPlaying, onReset }: { isPlaying: boolean, onReset: number }) {
    const ref = useRef<THREE.Mesh>(null!);
    const timeRef = useRef(0);

    useFrame((state, delta) => {
        if (isPlaying) {
            timeRef.current += delta;
        }

        // Reset check
        if (onReset !== ref.current.userData.lastReset) {
            timeRef.current = 0;
            ref.current.userData.lastReset = onReset;
        }

        const t = timeRef.current;
        // Spiral descent path
        const progress = Math.min(t * 0.15, 1);
        const radius = 3 * (1 - progress);
        const angle = t * 2.0;

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = calculateLoss(x, z) + 0.15; // Lift slightly above surface

        ref.current.position.set(x, y, z);
    });

    return (
        <Sphere ref={ref} args={[0.15, 32, 32]} position={[3, 1, 3]}>
            <meshStandardMaterial color="#fdcb6e" emissive="#fdcb6e" emissiveIntensity={0.8} />
        </Sphere>
    );
}

// --- Main Component ---

export default function GradientDescent() {
    const { topicId } = useParams();
    const [isPlaying, setIsPlaying] = useState(true);
    const [resetCount, setResetCount] = useState(0);

    const controls = (
        <GlassPane className="scene-controls" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
                <h1 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px', color: 'white' }}>Gradient Descent</h1>
                <p style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>Loss = 0.5 * (x² + y²)</p>
            </div>

            <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
                Visualizing the optimization path on a convex error surface. The ball represents the model parameters rolling down to the global minimum (lowest error).
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={() => setIsPlaying(!isPlaying)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: isPlaying ? '#ec4899' : '#1e293b', color: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    {isPlaying ? 'Pause' : 'Resume'}
                </button>
                <button onClick={() => setResetCount(c => c + 1)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <RefreshCcw size={14} />
                    Reset
                </button>
            </div>
        </GlassPane>
    );

    return (
        <SceneContainer backUrl={`/${topicId}`} controls={controls}>
            <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 10, 5]} intensity={1.0} />
                <pointLight position={[-3, 5, 3]} intensity={0.5} color="#00cec9" />

                <LossSurface />
                <DescentBall isPlaying={isPlaying} onReset={resetCount} />

                <gridHelper args={[10, 20, '#475569', '#1e293b']} position={[0, -0.01, 0]} />
                <OrbitControls enableDamping dampingFactor={0.05} />
                <fog attach="fog" args={['#0b0f19', 5, 15]} />
                <color attach="background" args={['#0b0f19']} />
            </Canvas>
        </SceneContainer>
    );
}
