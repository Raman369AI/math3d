import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ShieldCheck, Zap, BookOpen, Scale } from 'lucide-react';
import { useKatex } from '../../hooks/useKatex';
import { Latex } from '../../components/Latex';

type SigmaMode = 'atoms' | 'complement' | 'union' | 'universe';

interface SigmaSceneProps {
    level: number;
    mode: SigmaMode;
}

function SigmaScene({ level, mode }: SigmaSceneProps) {
    const setsRef = useRef<THREE.Group>(null!);

    const scenes = useMemo(() => {
        const meshes: THREE.Mesh[] = [];
        const colors = [0x3b82f6, 0xef4444, 0x10b981, 0xf59e0b, 0x8b5cf6, 0xec4899];

        if (mode === 'atoms') {
            const count = Math.pow(2, level);
            for (let i = 0; i < count; i++) {
                const phiStart = (i / count) * Math.PI * 2;
                const phiLength = (1 / count) * Math.PI * 2;
                const geo = new THREE.SphereGeometry(2.05, 32, 32, phiStart, phiLength, 0, Math.PI);
                const mat = new THREE.MeshPhongMaterial({
                    color: colors[i % colors.length],
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.6,
                });
                meshes.push(new THREE.Mesh(geo, mat));
            }
        } else if (mode === 'complement') {
            const aGeo = new THREE.SphereGeometry(2.1, 32, 32, 0, Math.PI, 0, Math.PI);
            const aMat = new THREE.MeshPhongMaterial({
                color: 0x3b82f6,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7,
            });
            meshes.push(new THREE.Mesh(aGeo, aMat));

            const acGeo = new THREE.SphereGeometry(2.1, 32, 32, Math.PI, Math.PI, 0, Math.PI);
            const acMat = new THREE.MeshPhongMaterial({
                color: 0xef4444,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.4,
            });
            meshes.push(new THREE.Mesh(acGeo, acMat));
        } else if (mode === 'union') {
            const count = 3;
            for (let i = 0; i < count; i++) {
                const phiStart = (i / 6) * Math.PI * 2;
                const phiLength = (1 / 8) * Math.PI * 2;
                const geo = new THREE.SphereGeometry(2.1, 32, 32, phiStart, phiLength, 0, Math.PI);
                const mat = new THREE.MeshPhongMaterial({
                    color: 0x10b981,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.8,
                });
                meshes.push(new THREE.Mesh(geo, mat));
            }
        } else if (mode === 'universe') {
            const geo = new THREE.SphereGeometry(2.1, 32, 32);
            const mat = new THREE.MeshPhongMaterial({
                color: 0x8b5cf6,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5,
            });
            meshes.push(new THREE.Mesh(geo, mat));
        }

        return meshes;
    }, [level, mode]);

    useFrame(() => {
        if (setsRef.current) {
            setsRef.current.rotation.y += 0.008;
            setsRef.current.rotation.x += 0.003;
        }
    });

    return (
        <>
            {/* Base wireframe sphere */}
            <mesh>
                <sphereGeometry args={[2, 32, 32]} />
                <meshPhongMaterial
                    color={0xe2e8f0}
                    transparent
                    opacity={0.1}
                    wireframe
                />
            </mesh>

            {/* Dynamic sets */}
            <group ref={setsRef}>
                {scenes.map((mesh, i) => (
                    <primitive key={i} object={mesh} />
                ))}
            </group>

            <pointLight position={[10, 10, 10]} intensity={1} />
            <ambientLight intensity={0.4} />
        </>
    );
}

export default function SigmaAlgebra() {
    const [sigmaLevel, setSigmaLevel] = useState(2);
    const [sigmaMode, setSigmaMode] = useState<SigmaMode>('atoms');
    const katexLoaded = useKatex();

    const getModeDescription = () => {
        switch (sigmaMode) {
            case 'universe':
                return "Rule I: If we can't measure 'Nothing' and 'Everything', we can't build a consistent math system. The purple sphere represents the total space Ω.";
            case 'complement':
                return "Rule II: If a Blue shape is 'legal' (measurable), then its opposite Red shape MUST also be legal. This ensures consistency when subtracting shapes.";
            case 'union':
                return "Rule III: The 'sigma' (σ) means countable. If you can measure pieces A, B, and C, you must be able to measure their combined blob.";
            case 'atoms':
                return katexLoaded
                    ? 'A σ-algebra defines your "pixel resolution". Higher level means more atoms, allowing you to measure finer details of the space.'
                    : 'A sigma-algebra defines your "pixel resolution". Higher level means more atoms, allowing you to measure finer details of the space.';
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: '#0f172a', overflowY: 'auto' }}>
            {/* Side Panel */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '400px',
                    height: '100%',
                    background: '#0f172a',
                    borderRight: '1px solid #1e293b',
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
                {/* Header */}
                <div>
                    <h2
                        style={{
                            fontSize: '24px',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <ShieldCheck size={24} style={{ color: '#6c5ce7' }} />
                        <span>
                            {katexLoaded ? <Latex formula="\sigma" /> : 'σ'}-Algebra
                        </span>
                    </h2>
                    <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
                        The &quot;whitelist&quot; rules that prevent mathematical paradoxes
                    </p>
                </div>

                {/* Main explanation */}
                <div
                    style={{
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        padding: '20px',
                    }}
                >
                    <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
                        To prevent mathematical paradoxes, we define a{' '}
                        <strong>{katexLoaded ? <Latex formula="\sigma" /> : 'σ'}-algebra</strong>: the collection
                        of &quot;legal&quot; shapes we can measure.
                    </p>
                </div>

                {/* Mode buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <RuleButton
                        active={sigmaMode === 'universe'}
                        onClick={() => setSigmaMode('universe')}
                        number="I"
                        title="Universe Rule"
                        formula={katexLoaded ? <Latex formula="\emptyset, \Omega \in \mathcal{F}" /> : '∅, Ω ∈ F'}
                    />
                    <RuleButton
                        active={sigmaMode === 'complement'}
                        onClick={() => setSigmaMode('complement')}
                        number="II"
                        title="Complement Rule"
                        formula={
                            katexLoaded ? (
                                <Latex formula="A \in \mathcal{F} \implies A^c \in \mathcal{F}" />
                            ) : (
                                'A ∈ F ⟹ Aᶜ ∈ F'
                            )
                        }
                    />
                    <RuleButton
                        active={sigmaMode === 'union'}
                        onClick={() => setSigmaMode('union')}
                        number="III"
                        title={['Countable Union (', katexLoaded ? <Latex formula="\sigma" /> : 'σ', ')']}
                        formula={katexLoaded ? <Latex formula="\bigcup A_n \in \mathcal{F}" /> : '⋃ Aₙ ∈ F'}
                    />
                    <RuleButton
                        active={sigmaMode === 'atoms'}
                        onClick={() => setSigmaMode('atoms')}
                        number="IV"
                        title="Information Resolution"
                        formula="Measure smaller chunks"
                    />
                </div>

                {/* Granularity slider for atoms mode */}
                {sigmaMode === 'atoms' && (
                    <div
                        style={{
                            background: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '12px',
                            padding: '16px',
                        }}
                    >
                        <label
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#94a3b8',
                                marginBottom: '12px',
                            }}
                        >
                            <span>Granularity Level:</span>
                            <span style={{ color: '#6c5ce7', fontWeight: 700 }}>
                                {Math.pow(2, sigmaLevel)} atoms
                            </span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="4"
                            value={sigmaLevel}
                            onChange={(e) => setSigmaLevel(parseInt(e.target.value))}
                            style={{
                                width: '100%',
                                height: '8px',
                                background: '#334155',
                                borderRadius: '4px',
                                outline: 'none',
                                cursor: 'pointer',
                                accentColor: '#6c5ce7',
                            }}
                        />
                    </div>
                )}
            </div>

            {/* 3D View */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: '400px',
                    right: 0,
                    height: '50vh',
                }}
            >
                <Canvas camera={{ position: [0, 0, 6], fov: 75 }} style={{ width: '100%', height: '100%' }}>
                    <color attach="background" args={['#f8fafc']} />
                    <SigmaScene level={sigmaLevel} mode={sigmaMode} />
                </Canvas>
                <div
                    style={{
                        padding: '16px 20px',
                        background: '#e2e8f0',
                        border: '1px solid #cbd5e1',
                        borderRadius: '12px',
                        fontSize: '13px',
                        color: '#334155',
                        lineHeight: 1.6,
                        margin: '16px',
                    }}
                >
                    {getModeDescription()}
                </div>
            </div>

            {/* Bottom content area */}
            <div
                style={{
                    position: 'absolute',
                    top: '50vh',
                    left: '400px',
                    right: 0,
                    bottom: 0,
                    overflowY: 'auto',
                    padding: '32px',
                    background: '#0f172a',
                }}
            >
                {/* Banach-Tarski Card */}
                <div
                    style={{
                        background: 'linear-gradient(135deg, #312e81, #1e1b4b)',
                        color: '#e0e7ff',
                        padding: '32px',
                        borderRadius: '24px',
                        marginBottom: '32px',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <Zap
                        size={128}
                        style={{
                            position: 'absolute',
                            right: '-16px',
                            top: '-16px',
                            opacity: 0.1,
                            transform: 'rotate(12deg)',
                        }}
                    />
                    <h3
                        style={{
                            fontSize: '22px',
                            fontWeight: 700,
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        The Banach-Tarski &quot;Crime Scene&quot;
                    </h3>
                    <p style={{ fontSize: '14px', color: '#c7d2fe', lineHeight: 1.6, marginBottom: '24px' }}>
                        Without a <strong>{katexLoaded ? <Latex formula="\sigma" /> : 'σ'}-algebra</strong>, you
                        could use the <strong>Axiom of Choice</strong> to pick an <em>uncountable</em> number of
                        points from a sphere and rearrange them into <strong>two identical spheres</strong>.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            <p style={{ fontWeight: 700, color: '#fff', marginBottom: '8px', fontSize: '13px' }}>
                                The Violation
                            </p>
                            <p style={{ fontSize: '12px', lineHeight: 1.5 }}>
                                The 5 pieces are created using &quot;uncountable&quot; selections. They aren&apos;t
                                in the {katexLoaded ? <Latex formula="\sigma" /> : 'σ'}-algebra.
                            </p>
                        </div>
                        <div
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            <p style={{ fontWeight: 700, color: '#fff', marginBottom: '8px', fontSize: '13px' }}>
                                The Consequence
                            </p>
                            <p style={{ fontSize: '12px', lineHeight: 1.5 }}>
                                Because they aren&apos;t in the {katexLoaded ? <Latex formula="\sigma" /> : 'σ'}
                                -algebra, they have <strong>no defined volume</strong>. Math can&apos;t
                                &quot;see&quot; them.
                            </p>
                        </div>
                        <div
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            <p style={{ fontWeight: 700, color: '#fff', marginBottom: '8px', fontSize: '13px' }}>
                                The Outcome
                            </p>
                            <p style={{ fontSize: '12px', lineHeight: 1.5 }}>
                                When they reform into two balls, math &quot;wakes up&quot; and sees two spheres.
                                Volume was created from nothing.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Deep Dive Section */}
                <div
                    style={{
                        background: '#1e293b',
                        padding: '32px',
                        borderRadius: '24px',
                        border: '1px solid #334155',
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h3
                            style={{
                                fontSize: '26px',
                                fontWeight: 800,
                                color: '#f8fafc',
                                marginBottom: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                            }}
                        >
                            <BookOpen size={28} style={{ color: '#3b82f6' }} />
                            <span>Deep Dive: The Mathematical Rules</span>
                        </h3>
                        <p style={{ fontSize: '14px', color: '#94a3b8', fontStyle: 'italic', maxWidth: '600px', margin: '0 auto' }}>
                            A {katexLoaded ? <Latex formula="\sigma" /> : 'σ'}-algebra defines which subsets of a
                            space are &quot;legal&quot; to calculate probabilities or volumes.
                        </p>
                    </div>

                    {/* Rules grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'rgba(59, 130, 246, 0.2)',
                                    color: '#3b82f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    flexShrink: 0,
                                }}
                            >
                                1
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '8px', fontSize: '15px' }}>
                                    The Universe Rule
                                </h4>
                                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
                                    The empty set {katexLoaded ? <Latex formula="\emptyset" /> : '∅'} and the entire
                                    space {katexLoaded ? <Latex formula="X" /> : 'X'} must be in{' '}
                                    {katexLoaded ? <Latex formula="\mathcal{F}" /> : 'F'}.{' '}
                                    <strong>Intuition:</strong> You must be able to say the volume of &quot;nothing&quot; is 0 and &quot;everything&quot; is 100%.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'rgba(59, 130, 246, 0.2)',
                                    color: '#3b82f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    flexShrink: 0,
                                }}
                            >
                                2
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '8px', fontSize: '15px' }}>
                                    The Complement Rule
                                </h4>
                                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
                                    If {katexLoaded ? <Latex formula="A \in \mathcal{F}" /> : 'A ∈ F'}, then{' '}
                                    {katexLoaded ? <Latex formula="A^c" /> : 'Aᶜ'} must be in{' '}
                                    {katexLoaded ? <Latex formula="\mathcal{F}" /> : 'F'}.{' '}
                                    <strong>Intuition:</strong> If you can measure a circle, you must measure the square minus that circle.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'rgba(59, 130, 246, 0.2)',
                                    color: '#3b82f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    flexShrink: 0,
                                }}
                            >
                                3
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '8px', fontSize: '15px' }}>
                                    The Countable Union Rule
                                </h4>
                                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
                                    If {katexLoaded ? <Latex formula="A_1, A_2, \dots \in \mathcal{F}" /> : 'A₁, A₂, ... ∈ F'}, then{' '}
                                    {katexLoaded ? <Latex formula="\bigcup A_n \in \mathcal{F}" /> : '⋃ Aₙ ∈ F'}.{' '}
                                    <strong>Intuition:</strong> The {katexLoaded ? <Latex formula="\sigma" /> : 'σ'} stands for countable. Add infinite sequences of pieces, result is still measurable.
                                </p>
                            </div>
                        </div>

                        <div
                            style={{
                                background: 'rgba(15, 23, 42, 0.6)',
                                padding: '20px',
                                borderRadius: '12px',
                                border: '1px solid #334155',
                            }}
                        >
                            <h4
                                style={{
                                    fontWeight: 700,
                                    fontSize: '15px',
                                    color: '#fbbf24',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                <Scale size={18} />
                                <span>Why &quot;Countable&quot; Matters</span>
                            </h4>
                            <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
                                <p style={{ marginBottom: '12px' }}>
                                    <strong>Countable Infinity:</strong> Like integers (1, 2, 3...). You can list them.
                                </p>
                                <p style={{ marginBottom: '12px' }}>
                                    <strong>Uncountable Infinity:</strong> Like all points on a line. Too many to list.
                                </p>
                                <div
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        fontSize: '12px',
                                    }}
                                >
                                    The "cheat" in Banach-Tarski uses <strong>uncountable</strong> selections. By staying within the {katexLoaded ? <Latex formula="\sigma" /> : 'σ'}-algebra, we ban the uncountable weirdness.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final note */}
                    <div
                        style={{
                            borderTop: '1px solid #334155',
                            paddingTop: '24px',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '24px',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
                                The &quot;Borel&quot; Standard in ML
                            </h4>
                            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '12px' }}>
                                In Machine Learning, we use the <strong>Borel {katexLoaded ? <Latex formula="\sigma" /> : 'σ'}-algebra</strong>. It contains all "open intervals" (like all numbers between 0 and 1).
                            </p>
                            <ul style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.8, paddingLeft: '20px' }}>
                                <li>Includes every shape you could draw or code</li>
                                <li>Contains spheres, cubes, and data curves</li>
                                <li>Does NOT contain the &quot;outlaw&quot; sets in Banach-Tarski</li>
                            </ul>
                        </div>
                        <div
                            style={{
                                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                padding: '24px',
                                borderRadius: '16px',
                                transform: 'rotate(1deg)',
                            }}
                        >
                            <h4 style={{ fontWeight: 700, color: '#fff', marginBottom: '8px', fontSize: '16px' }}>
                                The &quot;Safe Zone&quot; Contract
                            </h4>
                            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6 }}>
                                Measure Theory is the &quot;contract&quot; that says: &quot;As long as we stay inside
                                this {katexLoaded ? <Latex formula="\sigma" /> : 'σ'}-algebra, 1 + 1 will always
                                equal 2, and our probabilities will always sum to 1.&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface RuleButtonProps {
    active: boolean;
    onClick: () => void;
    number: string;
    title: string | React.ReactNode[];
    formula: React.ReactNode;
}

function RuleButton({ active, onClick, number, title, formula }: RuleButtonProps) {
    return (
        <button
            onClick={onClick}
            style={{
                width: '100%',
                textAlign: 'left',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: active ? '#6c5ce7' : '#334155',
                background: active ? '#6c5ce7' : '#1e293b',
                color: active ? '#fff' : '#cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
            }}
            onMouseEnter={(e) => {
                if (!active) {
                    e.currentTarget.style.background = '#334155';
                }
            }}
            onMouseLeave={(e) => {
                if (!active) {
                    e.currentTarget.style.background = '#1e293b';
                }
            }}
        >
            <div
                style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    background: active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(108, 92, 231, 0.2)',
                    color: active ? '#fff' : '#6c5ce7',
                    flexShrink: 0,
                }}
            >
                {number}
            </div>
            <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                    {title}
                </p>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>{formula}</div>
            </div>
        </button>
    );
}
