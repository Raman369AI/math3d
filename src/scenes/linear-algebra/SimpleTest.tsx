import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function RotatingCube() {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame(() => {
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#ff0080" emissive="#ff0080" emissiveIntensity={0.2} />
        </mesh>
    );
}

export default function SimpleTest() {
    return (
        <div style={{ width: '100%', height: '100%', background: '#0f172a', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '8px', zIndex: 10 }}>
                <strong>Simple WebGL Test</strong><br />
                You should see a bright pink rotating cube.<br />
                If you see this text but no cube, check the console for errors.
            </div>
            <Canvas
                camera={{ position: [5, 5, 5], fov: 45 }}
                gl={{ antialias: true, alpha: false }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <RotatingCube />
                <OrbitControls />
            </Canvas>
        </div>
    );
}
