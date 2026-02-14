import { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const PIECE_COUNT = 5;
const COLORS = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0x8b5cf6];
const SPHERE_RADIUS = 2;

interface SpherePieceProps {
    pieceId: number;
    setIndex: number;
    animationProgress: number;
}

function SpherePiece({ pieceId, setIndex, animationProgress }: SpherePieceProps) {
    const meshRef = useRef<THREE.Mesh>(null!);

    const geometry = useMemo(() => {
        const angleWidth = (Math.PI * 2) / PIECE_COUNT;
        const startAngle = pieceId * angleWidth;
        return new THREE.SphereGeometry(SPHERE_RADIUS, 64, 32, startAngle, angleWidth);
    }, [pieceId]);

    const startPos = useMemo(() => new THREE.Vector3(0, 0, 0), []);
    const targetPos = useMemo(
        () => new THREE.Vector3(setIndex === 0 ? -4.5 : 4.5, 0, 0),
        [setIndex]
    );

    const startRot = useMemo(() => new THREE.Euler(0, 0, 0), []);
    const targetRot = useMemo(
        () =>
            new THREE.Euler(
                setIndex === 0 ? 0 : Math.PI,
                setIndex === 0 ? 0 : Math.PI / 2,
                0
            ),
        [setIndex]
    );

    useFrame(() => {
        if (!meshRef.current) return;

        // Position interpolation
        meshRef.current.position.lerpVectors(startPos, targetPos, animationProgress);

        // Rotation interpolation
        meshRef.current.rotation.x = THREE.MathUtils.lerp(
            startRot.x,
            targetRot.x,
            animationProgress
        );
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
            startRot.y,
            targetRot.y,
            animationProgress
        );
        meshRef.current.rotation.z = THREE.MathUtils.lerp(
            startRot.z,
            targetRot.z,
            animationProgress
        );

        // Subtle scaling effect during transition
        const s = 1 + Math.sin(animationProgress * Math.PI) * 0.1;
        meshRef.current.scale.set(s, s, s);

        // Idle floating animation
        const time = Date.now() * 0.001;
        meshRef.current.position.y += Math.sin(time + pieceId * 0.5 + setIndex) * 0.003;
    });

    return (
        <mesh ref={meshRef} geometry={geometry}>
            <meshPhongMaterial
                color={COLORS[pieceId]}
                shininess={80}
                transparent
                opacity={0.85}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

function Scene({ animationProgress }: { animationProgress: number }) {
    const sceneRef = useRef<THREE.Group>(null!);

    useFrame(() => {
        if (sceneRef.current) {
            sceneRef.current.rotation.y += 0.003;
        }
    });

    return (
        <group ref={sceneRef}>
            {Array.from({ length: PIECE_COUNT }, (_, i) => (
                <group key={i}>
                    <SpherePiece
                        pieceId={i}
                        setIndex={0}
                        animationProgress={animationProgress}
                    />
                    <SpherePiece
                        pieceId={i}
                        setIndex={1}
                        animationProgress={animationProgress}
                    />
                </group>
            ))}
        </group>
    );
}

function InfoPanel({
    isSplit,
    onUnify,
    onSplit,
}: {
    isSplit: boolean;
    onUnify: () => void;
    onSplit: () => void;
}) {
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '360px',
                height: '100%',
                background: '#0f172a',
                borderLeft: '1px solid #1e293b',
                color: '#f8fafc',
                fontFamily: 'Inter, system-ui, sans-serif',
                overflowY: 'auto',
                zIndex: 20,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
            }}
        >
            <div>
                <h2
                    style={{
                        fontSize: '22px',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '6px',
                    }}
                >
                    Banach-Tarski Paradox
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
                    The impossibility made possible through infinite decomposition
                </p>
            </div>

            {/* Controls */}
            <div
                style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                }}
            >
                <button
                    onClick={onUnify}
                    disabled={!isSplit}
                    style={{
                        width: '100%',
                        padding: '12px 24px',
                        background: isSplit ? '#3b82f6' : '#334155',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: isSplit ? 'pointer' : 'not-allowed',
                        fontWeight: 600,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    Unify
                </button>
                <button
                    onClick={onSplit}
                    disabled={isSplit}
                    style={{
                        width: '100%',
                        padding: '12px 24px',
                        background: !isSplit ? '#3b82f6' : '#334155',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: !isSplit ? 'pointer' : 'not-allowed',
                        fontWeight: 600,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    Decompose &amp; Double
                </button>
            </div>

            {/* Explanation */}
            <div
                style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '16px',
                }}
            >
                <h3
                    style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#6c5ce7',
                        marginBottom: '12px',
                    }}
                >
                    How is this possible?
                </h3>
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '12px' }}>
                    In standard geometry, volume is preserved. But the paradox uses the{' '}
                    <strong style={{ color: '#f8fafc' }}>Axiom of Choice</strong> to create pieces that
                    are so infinitely &quot;jagged&quot; they have no measurable volume.
                </p>
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
                    By rotating these pieces around specific axes, the points &quot;re-align&quot; to
                    fill two whole spheres without any gaps. It&apos;s like taking the infinite points
                    of one line and mapping them onto two lines.
                </p>
            </div>

            {/* Mathematical Details */}
            <div
                style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '16px',
                }}
            >
                <h3
                    style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#6c5ce7',
                        marginBottom: '12px',
                    }}
                >
                    The Mathematics
                </h3>
                <ul
                    style={{
                        fontSize: '13px',
                        color: '#cbd5e1',
                        lineHeight: 1.8,
                        paddingLeft: '20px',
                        margin: 0,
                    }}
                >
                    <li>Relies on the Axiom of Choice (AC)</li>
                    <li>Pieces are non-measurable sets</li>
                    <li>Only works in 3D and higher dimensions</li>
                    <li>Impossible with physical objects</li>
                    <li>Demonstrated by Banach &amp; Tarski (1924)</li>
                </ul>
            </div>

            {/* Visual Legend */}
            <div
                style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '16px',
                }}
            >
                <h3
                    style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#6c5ce7',
                        marginBottom: '12px',
                    }}
                >
                    Visualization
                </h3>
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
                    Each color represents one of the 5 pieces. When decomposed, each piece is duplicated
                    and rotated to form two complete spheres.
                </p>
            </div>
        </div>
    );
}

function AnimationController({
    isSplit,
    onProgressUpdate,
}: {
    isSplit: boolean;
    onProgressUpdate: (progress: number) => void;
}) {
    const progressRef = useRef(0);

    useFrame(() => {
        const target = isSplit ? 1 : 0;
        progressRef.current += (target - progressRef.current) * 0.06;
        onProgressUpdate(progressRef.current);
    });

    return null;
}

export default function BanachTarski() {
    const [isSplit, setIsSplit] = useState(false);
    const [animationProgress, setAnimationProgress] = useState(0);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: '#0f172a' }}>
            <Canvas camera={{ position: [0, 2, 12], fov: 60 }} style={{ width: '100%', height: '100%' }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 10, 7.5]} intensity={0.8} />
                <pointLight position={[-5, -5, 5]} color="#3b82f6" intensity={0.5} />

                <Scene animationProgress={animationProgress} />
                <AnimationController isSplit={isSplit} onProgressUpdate={setAnimationProgress} />

                <OrbitControls enableDamping dampingFactor={0.05} />
                <fog attach="fog" args={['#0a0a0f', 8, 25]} />
            </Canvas>

            <InfoPanel
                isSplit={isSplit}
                onUnify={() => setIsSplit(false)}
                onSplit={() => setIsSplit(true)}
            />
        </div>
    );
}

