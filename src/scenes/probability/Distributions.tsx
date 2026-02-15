import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function GaussianSurface() {
    const meshRef = useRef<THREE.Mesh>(null!);

    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(8, 8, 64, 64);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = 2 * Math.exp(-(x * x + y * y) / 2);
            pos.setZ(i, z);
        }
        geo.computeVertexNormals();
        return geo;
    }, []);

    useFrame((state) => {
        meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    });

    return (
        <group rotation={[-Math.PI / 2, 0, 0]} ref={meshRef}>
            <mesh geometry={geometry}>
                <meshStandardMaterial
                    color="#fd79a8"
                    roughness={0.3}
                    metalness={0.6}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.7}
                />
            </mesh>
            <mesh geometry={geometry}>
                <meshBasicMaterial color="#fd79a8" wireframe transparent opacity={0.12} />
            </mesh>
        </group>
    );
}

const SAMPLE_POINTS = (() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 80; i++) {
        const u1 = Math.random();
        const u2 = Math.random();
        const x = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * 1.2;
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2) * 1.2;
        const y = 2 * Math.exp(-(x * x + z * z) / 2) + 0.05;
        pts.push([x, y, z]);
    }
    return pts;
})();

function SamplePoints() {
    return (
        <>
            {SAMPLE_POINTS.map((pos, i) => (
                <mesh key={i} position={pos}>
                    <sphereGeometry args={[0.04, 8, 8]} />
                    <meshStandardMaterial color="#fdcb6e" emissive="#fdcb6e" emissiveIntensity={0.6} />
                </mesh>
            ))}
        </>
    );
}

export default function Distributions() {
    return (
        <Canvas camera={{ position: [4, 4, 4], fov: 50 }} style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <pointLight position={[-3, 2, 3]} intensity={0.5} color="#fd79a8" />
            <GaussianSurface />
            <SamplePoints />
            <gridHelper args={[8, 16, '#222', '#181828']} position={[0, -0.01, 0]} />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <fog attach="fog" args={['#0a0a0f', 5, 15]} />
        </Canvas>
    );
}
