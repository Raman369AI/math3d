import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

function EigenvisualizationScene() {
    const groupRef = useRef<THREE.Group>(null!);
    const arrowRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        const scale = 1.5 + Math.sin(t * 0.8) * 0.8;

        if (arrowRef.current) {
            arrowRef.current.scale.set(scale, scale, scale);
        }
        groupRef.current.rotation.y = t * 0.1;
    });

    const ellipsoidPoints = useMemo(() => {
        const points: [number, number, number][] = [];
        for (let i = 0; i <= 64; i++) {
            const theta = (i / 64) * Math.PI * 2;
            points.push([Math.cos(theta) * 2, Math.sin(theta) * 1.2, 0]);
        }
        return points;
    }, []);

    return (
        <group ref={groupRef}>
            {/* Eigenvector 1 (scaled) */}
            <group ref={arrowRef}>
                <Line points={[[0, 0, 0], [2, 0, 0]]} color="#6c5ce7" lineWidth={4} />
                <mesh position={[2, 0, 0]}>
                    <coneGeometry args={[0.08, 0.3, 8]} />
                    <meshStandardMaterial color="#6c5ce7" emissive="#6c5ce7" emissiveIntensity={0.5} />
                </mesh>
            </group>

            {/* Eigenvector 2 (fixed direction) */}
            <Line points={[[0, 0, 0], [0, 1.2, 0]]} color="#00cec9" lineWidth={4} />
            <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0]}>
                <coneGeometry args={[0.08, 0.3, 8]} />
                <meshStandardMaterial color="#00cec9" emissive="#00cec9" emissiveIntensity={0.5} />
            </mesh>

            {/* Transformation ellipse */}
            <Line points={ellipsoidPoints} color="#fd79a8" lineWidth={1.5} opacity={0.5} transparent />

            <Text position={[2.5, 0.3, 0]} fontSize={0.25} color="#6c5ce7">λ₁v₁</Text>
            <Text position={[0.3, 1.6, 0]} fontSize={0.25} color="#00cec9">λ₂v₂</Text>

            <gridHelper args={[8, 16, '#222', '#181828']} position={[0, -0.01, 0]} rotation={[Math.PI / 2, 0, 0]} />
            <gridHelper args={[8, 16, '#222', '#181828']} position={[0, -0.01, 0]} />
        </group>
    );
}

export default function Eigenvalues() {
    return (
        <Canvas camera={{ position: [3, 2, 4], fov: 50 }} style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <EigenvisualizationScene />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <fog attach="fog" args={['#0a0a0f', 5, 15]} />
        </Canvas>
    );
}
