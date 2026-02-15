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
import styles from './LebesgueMeasure.module.css';

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
        <div className={styles.visualizerContainer}>
            {/* CSS-based 3D container */}
            <div
                className={styles.scene3d}
                style={{
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                }}
            >
                {/* Step 1: Basic Box */}
                {activeStep === 0 && (
                    <div className={styles.boxStep}>
                        <div className={styles.boxLabel}>
                            Volume =<br />Δx · Δy · Δz
                        </div>
                        {/* Sides of the box - Front/Back/Right/Left/Top/Bottom implicitly formed or suggested */}
                        {/* We add a couple of planes to give it depth */}
                        <div className={styles.boxPlaneY} />
                        <div className={styles.boxPlaneX} />
                    </div>
                )}

                {/* Step 2: Outer Measure (Cloud of boxes) */}
                {activeStep === 1 && (
                    <div className={styles.preserve3d}>
                        {/* Blob Backing */}
                        <div className={styles.blob} />
                        {/* Small Boxes */}
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div
                                key={i}
                                className={styles.smallBox}
                                style={{
                                    transform: `translate3d(${Math.sin(i) * 70}px, ${Math.cos(i * 1.3) * 70}px, ${Math.sin(i * 0.7) * 70}px)`,
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Step 3: Null Set (Flat Plane) */}
                {activeStep === 2 && (
                    <div className={styles.nullSetPlane}>
                        <div className={styles.nullSetText}>
                            Volume = 0
                        </div>
                    </div>
                )}
            </div>

            {/* UI Overlays */}
            <div className={styles.controlsOverlay}>
                <button
                    onClick={() => setIsRotating(!isRotating)}
                    title={isRotating ? 'Pause Rotation' : 'Play Rotation'}
                    className={styles.rotateButton}
                >
                    <RefreshCw size={16} className={isRotating ? styles.spinning : ''} />
                </button>
            </div>

            <div className={styles.titleOverlay}>
                3D Lebesgue Visualization Engine
            </div>
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
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.headerIconBox}>
                        <Ruler size={24} color="white" />
                    </div>
                    <div>
                        <h1 className={styles.headerTitle}>
                            Lebesgue Measure in ℝⁿ
                        </h1>
                        <p className={styles.headerSubtitle}>
                            The Universal Ruler for High-Dimensional Spaces
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.contentGrid}>
                    {/* Left Panel: The Visualization */}
                    <div className={styles.leftPanel}>
                        <Visualizer
                            activeStep={activeStep}
                            rotation={rotation}
                            isRotating={isRotating}
                            setIsRotating={setIsRotating}
                        />

                        <div className={styles.infoGrid}>
                            <div className={styles.infoCard}>
                                <h3 className={`${styles.infoCardTitle} ${styles.infoCardTitleBlue}`}>
                                    <Move size={12} /> Translation Invariance
                                </h3>
                                <p className={styles.infoCardText}>
                                    "Slide it, flip it, move it—the volume stays the same."
                                </p>
                            </div>
                            <div className={styles.infoCard}>
                                <h3 className={`${styles.infoCardTitle} ${styles.infoCardTitleIndigo}`}>
                                    <InfinityIcon size={12} /> Countable Additivity
                                </h3>
                                <p className={styles.infoCardText}>
                                    "The whole is exactly the sum of its separate parts."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Educational Steps */}
                    <div className={styles.rightPanel}>
                        {steps.map((step, idx) => {
                            const StepIcon = step.Icon;
                            const isActive = activeStep === idx;
                            return (
                                <div
                                    key={step.id}
                                    onClick={() => setActiveStep(idx)}
                                    className={`${styles.stepItem} ${isActive ? styles.stepItemActive : ''}`}
                                >
                                    <div className={styles.stepHeader}>
                                        <span className={`${styles.stepIcon} ${isActive ? styles.stepIconActive : ''}`}>
                                            <StepIcon size={20} />
                                        </span>
                                        <h2 className={`${styles.stepTitle} ${isActive ? styles.stepTitleActive : ''}`}>
                                            {step.title}
                                        </h2>
                                    </div>
                                    <p className={styles.stepContent}>
                                        {step.content}
                                    </p>
                                    {isActive && idx === 2 && (
                                        <div className={styles.mlAppBox}>
                                            <div className={styles.mlAppHeader}>
                                                <Info size={12} /> ML APPLICATION
                                            </div>
                                            <p className={styles.mlAppText}>
                                                A classifier's decision boundary is an (n-1) surface. It has measure 0. We
                                                don't worry about data falling 'exactly' on the line.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Summary Mini-Table */}
                        <div className={styles.summaryTable}>
                            <h3 className={styles.summaryTitle}>
                                Properties vs Intuition
                            </h3>
                            <div className={styles.summaryContent}>
                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Null Set</span>
                                    <span className={styles.summaryValue}>"Invisible" to volume</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Measurability</span>
                                    <span className={styles.summaryValue}>Almost any set works</span>
                                </div>
                                <div className={styles.summaryRowLast}>
                                    <span className={styles.summaryLabel}>Almost Everywhere</span>
                                    <span className={styles.summaryValue}>Ignoring zero-volume flaws</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer / CTA */}
            <footer className={styles.footer}>
                <button
                    onClick={() => {
                        setActiveStep((prev) => (prev + 1) % steps.length);
                    }}
                    className={styles.nextButton}
                >
                    {activeStep < 2 ? 'Next Concept' : 'Restart Exploration'}
                    <Play size={16} fill="currentColor" />
                </button>
            </footer>
        </div>
    );
};

export default LebesgueMeasure;
