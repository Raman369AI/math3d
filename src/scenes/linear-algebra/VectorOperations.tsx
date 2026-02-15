import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Arrow } from '../../components/3d/Arrow';

function AnimatedVectors() {
    const groupRef = useRef<THREE.Group>(null!);
    useFrame((state) => {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    });

    return (
        <group ref={groupRef}>
            <Arrow start={[0, 0, 0]} end={[2, 1, 0]} color="#6c5ce7" />
            <Arrow start={[0, 0, 0]} end={[0, 2, 1]} color="#a29bfe" />
            <Arrow start={[0, 0, 0]} end={[2, 3, 1]} color="#00cec9" />

            <Text position={[2.3, 1.1, 0]} fontSize={0.25} color="#6c5ce7">a⃗</Text>
            <Text position={[0.2, 2.3, 1]} fontSize={0.25} color="#a29bfe">b⃗</Text>
            <Text position={[2.3, 3.3, 1]} fontSize={0.25} color="#00cec9">a⃗+b⃗</Text>

            {/* Dashed parallelogram lines */}
            <Line points={[[2, 1, 0], [2, 3, 1]]} color="#555" lineWidth={1} dashed dashSize={0.1} gapSize={0.1} />
            <Line points={[[0, 2, 1], [2, 3, 1]]} color="#555" lineWidth={1} dashed dashSize={0.1} gapSize={0.1} />

            <gridHelper args={[8, 16, '#222', '#181828']} position={[0, -0.01, 0]} />
        </group>
    );
}

export default function VectorOperations() {
    return (
        <Canvas camera={{ position: [4, 3, 4], fov: 50 }} style={{ width: '100%', height: '100%' }} aria-label="Vector Addition Visualization">
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <AnimatedVectors />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <fog attach="fog" args={['#0a0a0f', 6, 16]} />
        </Canvas>
    );
}
