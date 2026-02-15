import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { calculateLoss } from '../../utils/math';

function LossSurface() {
    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(8, 8, 64, 64);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = calculateLoss(x, y);
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

function DescentBall() {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.elapsedTime;

        // Simulate gradient descent path
        const progress = (t * 0.15) % 1;
        const radius = 3 * (1 - progress);
        const angle = t * 0.8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = calculateLoss(x, z) + 0.1;

        ref.current.position.set(x, y, z);
    });

    return (
        <>
            <Sphere ref={ref} args={[0.12, 16, 16]} position={[3, 1, 3]}>
                <meshStandardMaterial color="#fdcb6e" emissive="#fdcb6e" emissiveIntensity={1} />
            </Sphere>
        </>
    );
}

export default function GradientDescent() {
    return (
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <pointLight position={[-3, 2, 3]} intensity={0.5} color="#00cec9" />
            <LossSurface />
            <DescentBall />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <fog attach="fog" args={['#0a0a0f', 6, 18]} />
        </Canvas>
    );
}
