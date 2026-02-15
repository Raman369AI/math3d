import { useMemo, useRef, useLayoutEffect } from 'react';
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

const POINTS_0 = POINTS.filter((p) => p.classId === 0);
const POINTS_1 = POINTS.filter((p) => p.classId === 1);

function InstancedPoints({
    points,
    color,
}: {
    points: typeof POINTS;
    color: string;
}) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const temp = useMemo(() => new THREE.Object3D(), []);

    useLayoutEffect(() => {
        if (!meshRef.current) return;
        points.forEach((pt, i) => {
            temp.position.set(...pt.pos);
            temp.updateMatrix();
            meshRef.current!.setMatrixAt(i, temp.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [points, temp]);

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, points.length]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
            />
        </instancedMesh>
    );
}

function DataPoints() {
    return (
        <>
            <InstancedPoints points={POINTS_0} color="#fdcb6e" />
            <InstancedPoints points={POINTS_1} color="#6c5ce7" />
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
