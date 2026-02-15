import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

function NeuronLayer({
    count,
    x,
    color,
}: {
    count: number;
    x: number;
    color: string;
}) {
    const neurons: [number, number, number][] = [];
    const spacing = 1.2;
    const offset = ((count - 1) * spacing) / 2;

    for (let i = 0; i < count; i++) {
        neurons.push([x, i * spacing - offset, 0]);
    }

    return (
        <>
            {neurons.map((pos, i) => (
                <Sphere key={i} args={[0.18, 16, 16]} position={pos}>
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={0.4}
                        roughness={0.3}
                        metalness={0.7}
                    />
                </Sphere>
            ))}
        </>
    );
}

function Connections({
    fromPositions,
    toPositions,
    color,
}: {
    fromPositions: [number, number, number][];
    toPositions: [number, number, number][];
    color: string;
}) {
    const lines = useMemo(() => {
        const result: { from: [number, number, number]; to: [number, number, number] }[] = [];
        for (const from of fromPositions) {
            for (const to of toPositions) {
                result.push({ from, to });
            }
        }
        return result;
    }, [fromPositions, toPositions]);

    return (
        <>
            {lines.map((line, i) => (
                <Line key={i} points={[line.from, line.to]} color={color} lineWidth={0.5} transparent opacity={0.3} />
            ))}
        </>
    );
}

function AnimatedPulse() {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        const x = -3 + ((t * 1.5) % 9) - 1;
        ref.current.position.x = x;
        ref.current.position.y = Math.sin(t * 2) * 0.5;
        const scale = 0.1 + Math.sin(t * 3) * 0.02;
        ref.current.scale.setScalar(scale / 0.1);
    });

    return (
        <Sphere ref={ref} args={[0.1, 16, 16]}>
            <meshStandardMaterial color="#fdcb6e" emissive="#fdcb6e" emissiveIntensity={1.5} />
        </Sphere>
    );
}

function NetworkScene() {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.3;
    });

    const layers = [
        { count: 3, x: -3, color: '#fdcb6e' },
        { count: 5, x: -1, color: '#fd79a8' },
        { count: 5, x: 1, color: '#6c5ce7' },
        { count: 2, x: 3, color: '#00cec9' },
    ];

    const getPositions = (count: number, x: number): [number, number, number][] => {
        const spacing = 1.2;
        const offset = ((count - 1) * spacing) / 2;
        return Array.from({ length: count }, (_, i) => [x, i * spacing - offset, 0] as [number, number, number]);
    };

    return (
        <group ref={groupRef}>
            {layers.map((layer, i) => (
                <NeuronLayer key={i} count={layer.count} x={layer.x} color={layer.color} />
            ))}
            {layers.slice(0, -1).map((layer, i) => (
                <Connections
                    key={i}
                    fromPositions={getPositions(layer.count, layer.x)}
                    toPositions={getPositions(layers[i + 1].count, layers[i + 1].x)}
                    color="#444"
                />
            ))}
            <AnimatedPulse />
        </group>
    );
}

export default function NeuralNetworks() {
    return (
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }} style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <NetworkScene />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <fog attach="fog" args={['#0a0a0f', 6, 18]} />
        </Canvas>
    );
}
