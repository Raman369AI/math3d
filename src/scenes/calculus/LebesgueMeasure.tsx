import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Ruler,
    Minimize2,
    Move,
    Infinity as InfinityIcon,
    Info,
    Play,
    RefreshCw,
    Layers,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// --- Types ---
interface Step {
    id: string;
    title: string;
    Icon: LucideIcon;
    content: string;
}

interface VisualizerProps {
    activeStep: number;
    rotation: { x: number; y: number };
    isRotating: boolean;
    setIsRotating: (rotating: boolean) => void;
}

// --- Visualizer Component ---
const Visualizer: React.FC<VisualizerProps> = ({ activeStep, rotation, isRotating, setIsRotating }) => {
    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '400px',
                backgroundColor: '#0f172a', // slate-900
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #334155', // slate-700
                boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                perspective: '1000px',
            }}
        >
            {/* CSS-based 3D container */}
            <div
                style={{
                    position: 'relative',
                    width: '192px', // w-48
                    height: '192px', // h-48
                    transition: 'transform 75ms',
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                }}
            >
                {/* Step 1: Basic Box */}
                {activeStep === 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '128px', // w-32
                            height: '128px', // h-32
                            margin: 'auto',
                            backgroundColor: 'rgba(59, 130, 246, 0.3)', // blue-500/30
                            border: '2px solid #60a5fa', // blue-400
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'translateZ(16px)',
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        <div
                            style={{
                                color: '#bfdbfe', // blue-200
                                fontWeight: 700,
                                fontSize: '12px',
                                textAlign: 'center',
                            }}
                        >
                            Volume =<br />Δx · Δy · Δz
                        </div>
                        {/* Sides of the box - Front/Back/Right/Left/Top/Bottom implicitly formed or suggested */}
                        {/* We add a couple of planes to give it depth */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                border: '1px solid rgba(96, 165, 250, 0.3)', // blue-400/30
                                transform: 'rotateY(90deg) translateZ(64px)',
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                border: '1px solid rgba(96, 165, 250, 0.3)', // blue-400/30
                                transform: 'rotateX(90deg) translateZ(64px)',
                            }}
                        />
                    </div>
                )}

                {/* Step 2: Outer Measure (Cloud of boxes) */}
                {activeStep === 1 && (
                    <div style={{ transformStyle: 'preserve-3d' }}>
                        {/* Blob Backing */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '9999px',
                                backgroundColor: 'rgba(168, 85, 247, 0.2)', // purple-500/20
                                filter: 'blur(24px)', // blur-2xl
                                transform: 'scale(1.25) translateZ(0px)',
                            }}
                        />
                        {/* Small Boxes */}
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    position: 'absolute',
                                    backgroundColor: 'rgba(74, 222, 128, 0.4)', // green-400/40
                                    border: '1px solid rgba(134, 239, 172, 0.5)', // green-300/50
                                    width: '16px',
                                    height: '16px',
                                    transform: `translate3d(${Math.sin(i) * 70}px, ${Math.cos(i * 1.3) * 70}px, ${Math.sin(i * 0.7) * 70}px)`,
                                    opacity: 0.8,
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Step 3: Null Set (Flat Plane) */}
                {activeStep === 2 && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '256px', // w-64
                            height: '256px', // h-64
                            transform: 'translate(-32px, -32px) rotateX(90deg)', // -translate-x-8 -translate-y-8
                            transformStyle: 'preserve-3d',
                            backgroundColor: 'rgba(245, 158, 11, 0.2)', // amber-500/20
                            border: '1px solid rgba(251, 191, 36, 0.5)', // amber-400/50
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div
                            style={{
                                color: '#fde68a', // amber-200
                                fontFamily: 'monospace',
                                fontSize: '14px',
                            }}
                        >
                            Volume = 0
                        </div>
                    </div>
                )}
            </div>

            {/* UI Overlays */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                }}
            >
                <button
                    onClick={() => setIsRotating(!isRotating)}
                    title={isRotating ? 'Pause Rotation' : 'Play Rotation'}
                    style={{
                        padding: '8px',
                        backgroundColor: '#1e293b', // slate-800
                        borderRadius: '9999px',
                        border: '1px solid #475569', // slate-600
                        cursor: 'pointer',
                        color: '#cbd5e1', // slate-300
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        transition: 'background-color 0.2s',
                    }}
                >
                    <RefreshCw size={16} style={{ animation: isRotating ? 'spin 1s linear infinite' : 'none' }} />
                </button>
            </div>

            <div
                style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: 'rgba(30, 41, 59, 0.8)', // slate-800/80
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    color: '#94a3b8', // slate-400
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    border: '1px solid #334155', // slate-700
                }}
            >
                3D Lebesgue Visualization Engine
            </div>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

// --- Main Component ---
const LebesgueMeasure: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [isRotating, setIsRotating] = useState(true);
    const [rotation, setRotation] = useState({ x: 15, y: 15 });
    const timerRef = useRef<number | null>(null);

    // Navigation Steps
    const steps: Step[] = [
        {
            id: 'building-blocks',
            title: '1. The Building Blocks',
            Icon: Box,
            content: "Lebesgue measure starts with n-dimensional boxes. In 1D, it's length; in 2D, it's area; in 3D, it's volume. It is the product of all side lengths.",
        },
        {
            id: 'outer-measure',
            title: '2. Outer Measure Strategy',
            Icon: Minimize2,
            content: "To measure a 'weird' shape, we cover it with tiny boxes. The Lebesgue measure is the limit as these boxes become infinitely small and tight around the shape.",
        },
        {
            id: 'null-sets',
            title: '3. The Null Set Rule',
            Icon: Layers,
            content: "In n-dimensional space, anything with fewer than n dimensions has a volume of ZERO. A 2D plane in 3D space is 'invisible' to the Lebesgue ruler.",
        },
    ];

    // Auto-rotation effect
    useEffect(() => {
        if (isRotating) {
            timerRef.current = window.setInterval(() => {
                setRotation((prev) => ({ ...prev, y: (prev.y + 0.5) % 360 }));
            }, 30);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRotating]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                backgroundColor: '#020617', // slate-950
                color: '#e2e8f0', // slate-200
                fontFamily: 'Inter, system-ui, sans-serif',
            }}
        >
            {/* Header */}
            <header
                style={{
                    padding: '24px',
                    borderBottom: '1px solid #1e293b', // slate-800
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                        style={{
                            backgroundColor: '#2563eb', // blue-600
                            padding: '8px',
                            borderRadius: '8px',
                        }}
                    >
                        <Ruler size={24} color="white" />
                    </div>
                    <div>
                        <h1
                            style={{
                                fontSize: '24px',
                                fontWeight: 700,
                                letterSpacing: '-0.025em',
                                background: 'linear-gradient(to right, #60a5fa, #a5b4fc)', // blue-400 to indigo-300
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                margin: 0,
                            }}
                        >
                            Lebesgue Measure in ℝⁿ
                        </h1>
                        <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                            The Universal Ruler for High-Dimensional Spaces
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column', // Mobile-first logic, but we can detect grid/flex
                    gap: '24px',
                    padding: '24px',
                    overflow: 'hidden',
                }}
            >
                <div style={{ display: 'flex', flex: 1, gap: '24px', overflow: 'hidden' }}>
                    {/* Left Panel: The Visualization */}
                    <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            overflowY: 'auto',
                        }}
                    >
                        <Visualizer
                            activeStep={activeStep}
                            rotation={rotation}
                            isRotating={isRotating}
                            setIsRotating={setIsRotating}
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div
                                style={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.5)', // slate-900/50
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: '1px solid #1e293b', // slate-800
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#60a5fa', // blue-400
                                        textTransform: 'uppercase',
                                        marginBottom: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    <Move size={12} /> Translation Invariance
                                </h3>
                                <p style={{ fontSize: '14px', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
                                    "Slide it, flip it, move it—the volume stays the same."
                                </p>
                            </div>
                            <div
                                style={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.5)', // slate-900/50
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: '1px solid #1e293b', // slate-800
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#818cf8', // indigo-400
                                        textTransform: 'uppercase',
                                        marginBottom: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    <InfinityIcon size={12} /> Countable Additivity
                                </h3>
                                <p style={{ fontSize: '14px', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
                                    "The whole is exactly the sum of its separate parts."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Educational Steps */}
                    <div
                        style={{
                            width: '384px', // w-96
                            display: 'flex', // Hidden on mobile in original? No, we'll keep it visible
                            flexDirection: 'column',
                            gap: '16px',
                            overflowY: 'auto',
                            paddingRight: '4px',
                        }}
                    >
                        {steps.map((step, idx) => {
                            const StepIcon = step.Icon;
                            const isActive = activeStep === idx;
                            return (
                                <div
                                    key={step.id}
                                    onClick={() => setActiveStep(idx)}
                                    style={{
                                        padding: '20px',
                                        borderRadius: '12px',
                                        border: isActive ? '1px solid #3b82f6' : '1px solid #1e293b',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        backgroundColor: isActive
                                            ? 'rgba(59, 130, 246, 0.1)'
                                            : '#0f172a', // slate-900
                                        boxShadow: isActive ? '0 0 15px rgba(59,130,246,0.1)' : 'none',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <span style={{ color: isActive ? '#60a5fa' : '#64748b' }}>
                                            <StepIcon size={20} />
                                        </span>
                                        <h2
                                            style={{
                                                fontWeight: 700,
                                                color: isActive ? '#fff' : '#94a3b8',
                                                margin: 0,
                                            }}
                                        >
                                            {step.title}
                                        </h2>
                                    </div>
                                    <p
                                        style={{
                                            fontSize: '14px',
                                            color: '#94a3b8',
                                            lineHeight: 1.6,
                                            margin: 0,
                                        }}
                                    >
                                        {step.content}
                                    </p>
                                    {isActive && idx === 2 && (
                                        <div
                                            style={{
                                                marginTop: '16px',
                                                padding: '12px',
                                                backgroundColor: '#020617', // slate-950
                                                borderRadius: '8px',
                                                border: '1px solid #1e293b', // slate-800
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    fontSize: '12px',
                                                    fontFamily: 'monospace',
                                                    color: '#f59e0b', // amber-500
                                                    marginBottom: '4px',
                                                }}
                                            >
                                                <Info size={12} /> ML APPLICATION
                                            </div>
                                            <p
                                                style={{
                                                    fontSize: '12px',
                                                    color: '#64748b',
                                                    fontStyle: 'italic',
                                                    lineHeight: 1.4,
                                                    margin: 0,
                                                }}
                                            >
                                                A classifier's decision boundary is an (n-1) surface. It has measure 0. We
                                                don't worry about data falling 'exactly' on the line.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Summary Mini-Table */}
                        <div
                            style={{
                                backgroundColor: '#0f172a', // slate-900
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid #1e293b', // slate-800
                                marginTop: '8px',
                            }}
                        >
                            <h3
                                style={{
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: '#64748b', // slate-500
                                    marginBottom: '12px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '-0.025em',
                                }}
                            >
                                Properties vs Intuition
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        borderBottom: '1px solid #1e293b',
                                        paddingBottom: '8px',
                                    }}
                                >
                                    <span style={{ color: '#cbd5e1' }}>Null Set</span>
                                    <span style={{ color: '#64748b', textAlign: 'right' }}>"Invisible" to volume</span>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        borderBottom: '1px solid #1e293b',
                                        paddingBottom: '8px',
                                    }}
                                >
                                    <span style={{ color: '#cbd5e1' }}>Measurability</span>
                                    <span style={{ color: '#64748b', textAlign: 'right' }}>Almost any set works</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#cbd5e1' }}>Almost Everywhere</span>
                                    <span style={{ color: '#64748b', textAlign: 'right' }}>Ignoring zero-volume flaws</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer / CTA */}
            <footer
                style={{
                    padding: '16px',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)', // slate-900/50
                    borderTop: '1px solid #1e293b', // slate-800
                    display: 'flex',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                <button
                    onClick={() => {
                        setActiveStep((prev) => (prev + 1) % steps.length);
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#2563eb', // blue-600
                        color: 'white',
                        padding: '8px 24px',
                        borderRadius: '9999px',
                        fontWeight: 500,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.2s',
                    }}
                >
                    {activeStep < 2 ? 'Next Concept' : 'Restart Exploration'}
                    <Play size={16} fill="currentColor" />
                </button>
            </footer>
        </div>
    );
};

export default LebesgueMeasure;
