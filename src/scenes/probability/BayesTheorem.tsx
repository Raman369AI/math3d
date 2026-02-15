import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function BayesBlocks() {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
    });

    const prior = 0.3;
    const likelihood = 0.8;
    const evidence = 0.5;
    const posterior = (likelihood * prior) / evidence;

    return (
        <group ref={groupRef}>
            {/* Prior P(A) */}
            <RoundedBox args={[1.2, prior * 3, 1.2]} position={[-2.5, (prior * 3) / 2, 0]} radius={0.05}>
                <meshStandardMaterial color="#fd79a8" roughness={0.3} metalness={0.6} transparent opacity={0.8} />
            </RoundedBox>
            <Text position={[-2.5, prior * 3 + 0.4, 0]} fontSize={0.2} color="#fd79a8">P(A) = {prior}</Text>
            <Text position={[-2.5, -0.4, 0]} fontSize={0.18} color="#888">Prior</Text>

            {/* Likelihood P(B|A) */}
            <RoundedBox args={[1.2, likelihood * 3, 1.2]} position={[-0.5, (likelihood * 3) / 2, 0]} radius={0.05}>
                <meshStandardMaterial color="#6c5ce7" roughness={0.3} metalness={0.6} transparent opacity={0.8} />
            </RoundedBox>
            <Text position={[-0.5, likelihood * 3 + 0.4, 0]} fontSize={0.2} color="#6c5ce7">P(B|A) = {likelihood}</Text>
            <Text position={[-0.5, -0.4, 0]} fontSize={0.18} color="#888">Likelihood</Text>

            {/* Evidence P(B) */}
            <RoundedBox args={[1.2, evidence * 3, 1.2]} position={[1.5, (evidence * 3) / 2, 0]} radius={0.05}>
                <meshStandardMaterial color="#00cec9" roughness={0.3} metalness={0.6} transparent opacity={0.8} />
            </RoundedBox>
            <Text position={[1.5, evidence * 3 + 0.4, 0]} fontSize={0.2} color="#00cec9">P(B) = {evidence}</Text>
            <Text position={[1.5, -0.4, 0]} fontSize={0.18} color="#888">Evidence</Text>

            {/* Posterior P(A|B) */}
            <RoundedBox args={[1.2, posterior * 3, 1.2]} position={[3.5, (posterior * 3) / 2, 0]} radius={0.05}>
                <meshStandardMaterial color="#fdcb6e" roughness={0.3} metalness={0.6} transparent opacity={0.8} />
            </RoundedBox>
            <Text position={[3.5, posterior * 3 + 0.4, 0]} fontSize={0.2} color="#fdcb6e">P(A|B) = {posterior.toFixed(2)}</Text>
            <Text position={[3.5, -0.4, 0]} fontSize={0.18} color="#888">Posterior</Text>

            <gridHelper args={[10, 20, '#222', '#181828']} position={[0.5, -0.01, 0]} />
        </group>
    );
}

export default function BayesTheorem() {
    return (
        <Canvas camera={{ position: [3, 3, 6], fov: 50 }} style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <pointLight position={[-3, 2, 3]} intensity={0.5} color="#fd79a8" />
            <BayesBlocks />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <fog attach="fog" args={['#0a0a0f', 6, 18]} />
        </Canvas>
    );
}
