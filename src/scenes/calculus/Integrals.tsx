import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function IntegralBars() {
    const groupRef = useRef<THREE.Group>(null!);
    const barCount = 24;

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        groupRef.current.children.forEach((child, i) => {
            if (child instanceof THREE.Mesh) {
                const x = (i / barCount) * 4 - 2;
                const height = Math.max(0.05, Math.sin(x + t * 0.5) * Math.cos(x * 0.5) + 1);
                child.scale.y = height;
                child.position.y = height / 2;
            }
        });
    });

    const bars = useMemo(() => {
        const result = [];
        const width = 4 / barCount;
        for (let i = 0; i < barCount; i++) {
            const x = (i / barCount) * 4 - 2 + width / 2;
            result.push(
                <mesh key={i} position={[x, 0.5, 0]}>
                    <boxGeometry args={[width * 0.9, 1, 0.6]} />
                    <meshStandardMaterial
                        color={`hsl(${175 + i * 3}, 70%, 50%)`}
                        roughness={0.3}
                        metalness={0.6}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            );
        }
        return result;
    }, []);

    return (
        <group ref={groupRef}>
            {bars}
            <gridHelper args={[8, 16, '#222', '#181828']} position={[0, 0, 0]} />
        </group>
    );
}

export default function Integrals() {
    return (
        <Canvas camera={{ position: [3, 3, 4], fov: 50 }} style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <pointLight position={[-3, 2, 3]} intensity={0.5} color="#00cec9" />
            <IntegralBars />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <fog attach="fog" args={['#0a0a0f', 5, 15]} />
        </Canvas>
    );
}
