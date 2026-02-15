import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

function LossLandscape() {
    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(8, 8, 64, 64);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z =
                (x * x + y * y) * 0.08 +
                Math.sin(x * 1.5) * Math.cos(y * 1.5) * 0.4 +
                Math.sin(x * 0.3) * 0.5;
            pos.setZ(i, z);
        }
        geo.computeVertexNormals();
        return geo;
    }, []);

    return (
        <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh geometry={geometry}>
                <meshStandardMaterial
                    color="#fdcb6e"
                    roughness={0.4}
                    metalness={0.5}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.5}
                />
            </mesh>
            <mesh geometry={geometry}>
                <meshBasicMaterial color="#f39c12" wireframe transparent opacity={0.08} />
            </mesh>
        </group>
    );
}

function DescentPath() {
    const ballRef = useRef<THREE.Mesh>(null!);
    const lineRef = useRef<any>(null!);
    const trailRef = useRef<[number, number, number][]>([]);

    const flatPoints = useMemo(() => new Float32Array(61 * 3), []);
    const initialPoints = useMemo(
        () => new Array(61).fill([0, 0, 0]) as [number, number, number][],
        []
    );

    useFrame((state) => {
        const t = state.clock.elapsedTime * 0.4;
        const progress = t % 6;
        const radius = Math.max(0.1, 3 - progress * 0.5);
        const angle = progress * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y =
            (x * x + z * z) * 0.08 +
            Math.sin(x * 1.5) * Math.cos(z * 1.5) * 0.4 +
            Math.sin(x * 0.3) * 0.5 +
            0.15;

        ballRef.current.position.set(x, y, z);

        if (Math.floor(t * 10) % 2 === 0) {
            trailRef.current = [...trailRef.current.slice(-60), [x, y, z]];

            if (lineRef.current) {
                const points = trailRef.current;
                const len = points.length;
                const fillCount = 61 - len;
                const firstPoint = points[0] || [x, y, z];

                for (let i = 0; i < 61; i++) {
                    const p = i < fillCount ? firstPoint : points[i - fillCount];
                    flatPoints[i * 3] = p[0];
                    flatPoints[i * 3 + 1] = p[1];
                    flatPoints[i * 3 + 2] = p[2];
                }
                lineRef.current.geometry.setPositions(flatPoints);
            }
        }
    });

    return (
        <>
            <Sphere ref={ballRef} args={[0.12, 16, 16]}>
                <meshStandardMaterial color="#fd79a8" emissive="#fd79a8" emissiveIntensity={1} />
            </Sphere>
            <Line
                ref={lineRef}
                points={initialPoints}
                color="#fd79a8"
                lineWidth={2}
                transparent
                opacity={0.5}
            />
        </>
    );
}

export default function GradientDescentML() {
    return (
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <pointLight position={[-3, 2, 3]} intensity={0.5} color="#fdcb6e" />
            <LossLandscape />
            <DescentPath />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <fog attach="fog" args={['#0a0a0f', 6, 18]} />
        </Canvas>
    );
}
