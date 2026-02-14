import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function MonteCarloPoints() {
    const [points, setPoints] = useState<{ pos: [number, number, number]; inside: boolean }[]>([]);
    const frameCount = useRef(0);

    useFrame(() => {
        frameCount.current++;
        if (frameCount.current % 5 === 0 && points.length < 500) {
            const x = (Math.random() - 0.5) * 4;
            const y = (Math.random() - 0.5) * 4;
            const z = (Math.random() - 0.5) * 4;
            const inside = Math.sqrt(x * x + y * y + z * z) <= 2;
            setPoints((prev) => [...prev, { pos: [x, y, z], inside }]);
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
    return (
        <Canvas camera={{ position: [4, 3, 4], fov: 50 }} style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <pointLight position={[-3, 2, 3]} intensity={0.5} color="#fd79a8" />
            <BoundingSphere />
            <BoundingBox />
            <MonteCarloPoints />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <fog attach="fog" args={['#0a0a0f', 5, 15]} />
        </Canvas>
    );
}
