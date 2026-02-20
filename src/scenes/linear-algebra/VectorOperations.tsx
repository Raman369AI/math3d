import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Arrow } from '../../components/3d/Arrow'; // Assuming arrow component exists
import { SceneContainer } from '../../components/layout/SceneContainer';
import { GlassPane } from '../../components/layout/GlassPane';
import { useParams } from 'react-router-dom';
import { RefreshCcw } from 'lucide-react';

function AnimatedVectors({ vecA, vecB }: { vecA: [number, number, number], vecB: [number, number, number] }) {
    // Calculate Sum Vector (A + B)
    const vecSum: [number, number, number] = [
        vecA[0] + vecB[0],
        vecA[1] + vecB[1],
        vecA[2] + vecB[2]
    ];

    // Calculate Parallelogram points
    // Origin -> A -> (A+B) -> B -> Origin
    // A -> A+B
    // B -> A+B

    // Convert to Vector3 for ease
    const vA = new THREE.Vector3(...vecA);
    const vB = new THREE.Vector3(...vecB);
    const vSum = new THREE.Vector3(...vecSum);
    return (
        <group>
            {/* Vector A (Purple) */}
            <Arrow start={[0, 0, 0]} end={vecA} color="#a78bfa" />
            <Text position={[vA.x / 2, vA.y / 2 + 0.2, vA.z / 2]} fontSize={0.25} color="#a78bfa" outlineWidth={0.02} outlineColor="#000">a⃗</Text>

            {/* Vector B (Blue) */}
            <Arrow start={[0, 0, 0]} end={vecB} color="#60a5fa" />
            <Text position={[vB.x / 2, vB.y / 2 + 0.2, vB.z / 2]} fontSize={0.25} color="#60a5fa" outlineWidth={0.02} outlineColor="#000">b⃗</Text>

            {/* Sum Vector (Green) */}
            <Arrow start={[0, 0, 0]} end={vecSum} color="#34d399" />
            <Text position={[vSum.x, vSum.y + 0.2, vSum.z]} fontSize={0.25} color="#34d399" outlineWidth={0.02} outlineColor="#000">a⃗+b⃗</Text>

            {/* Parallelogram Dashed Lines */}
            <Line points={[vA, vSum]} color="#64748b" dashed dashSize={0.2} gapSize={0.1} opacity={0.5} transparent />
            <Line points={[vB, vSum]} color="#64748b" dashed dashSize={0.2} gapSize={0.1} opacity={0.5} transparent />
        </group>
    );
}

export default function VectorOperations() {
    const { topicId } = useParams();
    const [vecA, setVecA] = useState<[number, number, number]>([2, 1, 0]);
    const [vecB, setVecB] = useState<[number, number, number]>([0, 2, 1]);

    const reset = () => {
        setVecA([2, 1, 0]);
        setVecB([0, 2, 1]);
    };

    const controls = (
        <GlassPane className="scene-controls" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
                <h1 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px', color: 'white' }}>Vector Addition</h1>
                <p style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>Parallelogram Rule</p>
            </div>

            {/* Vector A Controls */}
            <div>
                <div style={{ color: '#a78bfa', fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>Vector A</div>
                {['x', 'y', 'z'].map((axis, i) => (
                    <div key={axis} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', width: '15px' }}>{axis.toUpperCase()}</span>
                        <input
                            type="range" min="-3" max="3" step="0.1"
                            value={vecA[i]}
                            onChange={(e) => {
                                const newVec = [...vecA] as [number, number, number];
                                newVec[i] = parseFloat(e.target.value);
                                setVecA(newVec);
                            }}
                            style={{ width: '100%', accentColor: '#a78bfa', height: '4px' }}
                        />
                        <span style={{ fontSize: '11px', color: '#cbd5e1', width: '25px', textAlign: 'right' }}>{vecA[i]}</span>
                    </div>
                ))}
            </div>

            {/* Vector B Controls */}
            <div>
                <div style={{ color: '#60a5fa', fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>Vector B</div>
                {['x', 'y', 'z'].map((axis, i) => (
                    <div key={axis} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', width: '15px' }}>{axis.toUpperCase()}</span>
                        <input
                            type="range" min="-3" max="3" step="0.1"
                            value={vecB[i]}
                            onChange={(e) => {
                                const newVec = [...vecB] as [number, number, number];
                                newVec[i] = parseFloat(e.target.value);
                                setVecB(newVec);
                            }}
                            style={{ width: '100%', accentColor: '#60a5fa', height: '4px' }}
                        />
                        <span style={{ fontSize: '11px', color: '#cbd5e1', width: '25px', textAlign: 'right' }}>{vecB[i]}</span>
                    </div>
                ))}
            </div>

            <button onClick={reset} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <RefreshCcw size={14} /> Reset Vectors
            </button>
        </GlassPane>
    );

    return (
        <SceneContainer backUrl={`/${topicId}`} controls={controls}>
            <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 10, 5]} intensity={1.0} />

                <gridHelper args={[10, 20, '#475569', '#1e293b']} position={[0, -0.01, 0]} />
                <axesHelper args={[5]} />

                <AnimatedVectors vecA={vecA} vecB={vecB} />

                <OrbitControls enableDamping dampingFactor={0.05} />
                <fog attach="fog" args={['#0b0f19', 5, 20]} />
                <color attach="background" args={['#0b0f19']} />
            </Canvas>
        </SceneContainer>
    );
}
