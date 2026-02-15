import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Arrow } from '../../components/3d/Arrow';
import { Label } from '../../components/3d/Label';
import { generateEllipsePoints } from '../../utils/geometry';

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
        return generateEllipsePoints(2, 1.2, 64);
    }, []);

    return (
        <group ref={groupRef}>
            {/* Eigenvector 1 (scaled) */}
            <group ref={arrowRef}>
                <Arrow start={[0,0,0]} end={[2,0,0]} color="#6c5ce7" lineWidth={4} />
            </group>

            {/* Eigenvector 2 (fixed direction) */}
            <Arrow start={[0,0,0]} end={[0,1.2,0]} color="#00cec9" lineWidth={4} />

            {/* Transformation ellipse */}
            <Line points={ellipsoidPoints} color="#fd79a8" lineWidth={1.5} opacity={0.5} transparent />

            <Label text="λ₁v₁" position={[2.5, 0.3, 0]} color="#6c5ce7" fontSize={0.25} />
            <Label text="λ₂v₂" position={[0.3, 1.6, 0]} color="#00cec9" fontSize={0.25} />

            <gridHelper args={[8, 16, '#222', '#181828']} position={[0, -0.01, 0]} rotation={[Math.PI / 2, 0, 0]} />
            <gridHelper args={[8, 16, '#222', '#181828']} position={[0, -0.01, 0]} />
        </group>
    );
}

export default function Eigenvalues() {
    return (
        <Canvas camera={{ position: [3, 2, 4], fov: 50 }} style={{ width: '100%', height: '100%' }} aria-label="Eigenvalues Visualization">
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <EigenvisualizationScene />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <fog attach="fog" args={['#0a0a0f', 5, 15]} />
        </Canvas>
    );
}
