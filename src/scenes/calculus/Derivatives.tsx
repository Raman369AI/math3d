import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';

function Surface() {
    const meshRef = useRef<THREE.Mesh>(null!);
    const tangentRef = useRef<THREE.Group>(null!);

    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(6, 6, 48, 48);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            pos.setZ(i, Math.sin(x) * Math.cos(y) * 0.8);
        }
        geo.computeVertexNormals();
        return geo;
    }, []);

    useFrame((state) => {
        const t = state.clock.elapsedTime * 0.3;
        const x = Math.sin(t) * 2;
        const y = Math.cos(t) * 2;
        const z = Math.sin(x) * Math.cos(y) * 0.8;

        // Tangent point
        if (tangentRef.current) {
            tangentRef.current.position.set(x, y, z);
        }
    });

    return (
        <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh ref={meshRef} geometry={geometry}>
                <meshStandardMaterial
                    color="#00cec9"
                    roughness={0.4}
                    metalness={0.6}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.7}
                    wireframe={false}
                />
            </mesh>

            {/* Wireframe overlay */}
            <mesh geometry={geometry}>
                <meshBasicMaterial color="#00cec9" wireframe transparent opacity={0.15} />
            </mesh>

            {/* Moving tangent point */}
            <group ref={tangentRef}>
                <mesh>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color="#fdcb6e" emissive="#fdcb6e" emissiveIntensity={0.8} />
                </mesh>
                {/* Tangent line */}
                <Line
                    points={[[-0.8, 0, 0], [0.8, 0, 0]]}
                    color="#fd79a8"
                    lineWidth={3}
                />
            </group>
        </group>
    );
}

export default function Derivatives() {
    return (
        <Canvas camera={{ position: [4, 3, 4], fov: 50 }} style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <pointLight position={[-3, 2, 3]} intensity={0.5} color="#00cec9" />
            <Surface />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <fog attach="fog" args={['#0a0a0f', 5, 15]} />
        </Canvas>
    );
}
