import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const POINTS = (() => {
    const pts: { pos: [number, number, number]; classId: number }[] = [];
    // Class 0 cluster
    for (let i = 0; i < 40; i++) {
        pts.push({
            pos: [
                -1.5 + (Math.random() - 0.5) * 2,
                -1 + (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
            ],
            classId: 0,
        });
    }
    // Class 1 cluster
    for (let i = 0; i < 40; i++) {
        pts.push({
            pos: [
                1.5 + (Math.random() - 0.5) * 2,
                1 + (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
            ],
            classId: 1,
        });
    }
    return pts;
})();

function DataPoints() {
    return (
        <>
            {POINTS.map((pt, i) => (
                <mesh key={i} position={pt.pos}>
                    <sphereGeometry args={[0.08, 12, 12]} />
                    <meshStandardMaterial
                        color={pt.classId === 0 ? '#fdcb6e' : '#6c5ce7'}
                        emissive={pt.classId === 0 ? '#fdcb6e' : '#6c5ce7'}
                        emissiveIntensity={0.5}
                    />
                </mesh>
            ))}
        </>
    );
}

function DecisionPlane() {
    return (
        <mesh rotation={[0, 0, Math.PI / 6]}>
            <planeGeometry args={[8, 8]} />
            <meshStandardMaterial
                color="#00cec9"
                transparent
                opacity={0.1}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

function DecisionPlaneEdge() {
    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(8, 8);
        return new THREE.EdgesGeometry(geo);
    }, []);

    return (
        <lineSegments rotation={[0, 0, Math.PI / 6]} geometry={geometry}>
            <lineBasicMaterial color="#00cec9" transparent opacity={0.3} />
        </lineSegments>
    );
}

export default function DecisionBoundaries() {
    return (
        <Canvas camera={{ position: [4, 3, 4], fov: 50 }} style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <pointLight position={[-3, 2, 3]} intensity={0.5} color="#fdcb6e" />
            <DataPoints />
            <DecisionPlane />
            <DecisionPlaneEdge />
            <gridHelper args={[8, 16, '#222', '#181828']} position={[0, -3, 0]} />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <fog attach="fog" args={['#0a0a0f', 5, 15]} />
        </Canvas>
    );
}
