import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type IntegrationMode = 'riemann' | 'lebesgue';
type FunctionType = 'smooth' | 'spiky';

interface SurfaceProps {
    functionType: FunctionType;
}

interface IntegrationVisualizationProps {
    mode: IntegrationMode;
    functionType: FunctionType;
    resolution: number;
}

const fSmooth = (x: number, y: number): number => {
    const d = Math.sqrt(x * x + y * y);
    return (Math.sin(x * 0.4) * Math.cos(y * 0.4) + Math.cos(d * 0.5) * 0.5 + 1.5) * 2;
};

const fSpiky = (x: number, y: number): number => {
    let val = 0.5;
    const spikes = [
        [3, 3],
        [-4, 2],
        [0, -5],
        [5, -2],
    ];
    spikes.forEach((s) => {
        const distSq = Math.pow(x - s[0], 2) + Math.pow(y - s[1], 2);
        val += 8 * Math.exp(-distSq * 5);
    });
    return val;
};

function Surface({ functionType }: SurfaceProps) {
    const f = functionType === 'smooth' ? fSmooth : fSpiky;

    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(20, 20, 80, 80);
        geo.rotateX(-Math.PI / 2);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            pos.setY(i, f(pos.getX(i), pos.getZ(i)));
        }
        geo.computeVertexNormals();
        return geo;
    }, [f]);

    return (
        <mesh geometry={geometry}>
            <meshPhongMaterial
                color={0x475569}
                wireframe
                transparent
                opacity={0.15}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

function IntegrationVisualization({ mode, functionType, resolution }: IntegrationVisualizationProps) {
    const groupRef = useRef<THREE.Group>(null!);
    const f = functionType === 'smooth' ? fSmooth : fSpiky;

    const boxes = useMemo(() => {
        const boxData: Array<{ position: [number, number, number]; scale: [number, number, number]; color: THREE.Color }> =
            [];

        if (mode === 'riemann') {
            const step = 20 / resolution;
            const start = -10 + step / 2;
            const gap = 0.05;

            for (let i = 0; i < resolution; i++) {
                for (let j = 0; j < resolution; j++) {
                    const x = start + i * step;
                    const z = start + j * step;
                    const h = f(x, z);
                    if (h < 0.1) continue;

                    const color = new THREE.Color().setHSL(0.6, 0.7, 0.3 + h / 12);
                    boxData.push({
                        position: [x, h / 2, z],
                        scale: [step - gap, h, step - gap],
                        color,
                    });
                }
            }
        } else {
            // Lebesgue
            const maxH = 9.0;
            const hStep = maxH / resolution;
            const gridPts = 40;
            const floorStep = 20 / gridPts;
            const gap = 0.02;

            for (let k = 0; k < resolution; k++) {
                const hLevel = k * hStep;
                const color = new THREE.Color().setHSL(0.05, 0.8, 0.3 + hLevel / 15);

                for (let i = 0; i < gridPts; i++) {
                    for (let j = 0; j < gridPts; j++) {
                        const x = -10 + i * floorStep;
                        const z = -10 + j * floorStep;
                        if (f(x, z) >= hLevel + hStep) {
                            boxData.push({
                                position: [x, hLevel + hStep / 2, z],
                                scale: [floorStep, hStep - gap, floorStep],
                                color,
                            });
                        }
                    }
                }
            }
        }

        return boxData;
    }, [mode, resolution, f]);

    return (
        <group ref={groupRef}>
            {boxes.map((box, i) => (
                <mesh key={i} position={box.position} scale={box.scale}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshPhongMaterial color={box.color} transparent opacity={mode === 'riemann' ? 0.8 : 0.7} />
                </mesh>
            ))}
        </group>
    );
}

function Scene({ mode, functionType, resolution }: IntegrationVisualizationProps) {
    const sceneRef = useRef<THREE.Group>(null!);

    useFrame(() => {
        // Subtle idle rotation
        if (sceneRef.current) {
            sceneRef.current.rotation.y += 0.001;
        }
    });

    return (
        <group ref={sceneRef}>
            <gridHelper args={[20, 20, 0x1e293b, 0x0f172a]} />
            <Surface functionType={functionType} />
            <IntegrationVisualization mode={mode} functionType={functionType} resolution={resolution} />
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 30, 10]} intensity={1.2} />
        </group>
    );
}

export default function RiemannVsLebesgue() {
    const [mode, setMode] = useState<IntegrationMode>('riemann');
    const [functionType, setFunctionType] = useState<FunctionType>('smooth');
    const [resolution, setResolution] = useState(12);

    const getModeDescription = () => {
        if (mode === 'riemann') {
            return {
                title: 'Riemann & Spikes',
                text: 'Riemann checks specific points on the floor. If a spike is narrower than the grid square, Riemann misses the "volume" of that spike entirely.',
            };
        } else {
            return {
                title: 'Lebesgue & Spikes',
                text: 'Lebesgue asks: "Does the height 8.0 exist anywhere?" It finds the spikes regardless of position because it slices by value, not location.',
            };
        }
    };

    const description = getModeDescription();
    const colorIndicator = mode === 'riemann'
        ? 'linear-gradient(to right, #3b82f6, #8b5cf6)'
        : 'linear-gradient(to bottom, #ef4444, #f59e0b)';
    const legendText = mode === 'riemann' ? 'Riemann (Vertical Slicing)' : 'Lebesgue (Horizontal Slicing)';

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: '#020617' }}>
            {/* Controls Panel */}
            <div
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 10,
                    background: 'rgba(15, 23, 42, 0.95)',
                    padding: '24px',
                    borderRadius: '16px',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    maxWidth: '340px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                    color: '#fff',
                    fontFamily: 'Inter, system-ui, sans-serif',
                }}
            >
                <h1
                    style={{
                        fontSize: '24px',
                        fontWeight: 900,
                        marginBottom: '4px',
                        fontStyle: 'italic',
                        letterSpacing: '-0.02em',
                    }}
                >
                    Spikes & Slices
                </h1>
                <p
                    style={{
                        color: '#94a3b8',
                        fontSize: '10px',
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 600,
                    }}
                >
                    Riemann vs Lebesgue
                </p>

                {/* Function Selection */}
                <div style={{ marginBottom: '16px' }}>
                    <p
                        style={{
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            color: '#64748b',
                            fontWeight: 700,
                            marginBottom: '8px',
                        }}
                    >
                        Select Function
                    </p>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                            onClick={() => setFunctionType('smooth')}
                            style={{
                                background: functionType === 'smooth' ? '#334155' : '#1e293b',
                                color: functionType === 'smooth' ? '#fff' : '#94a3b8',
                                fontSize: '12px',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: functionType === 'smooth' ? '1px solid #475569' : '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            Smooth Hills
                        </button>
                        <button
                            onClick={() => setFunctionType('spiky')}
                            style={{
                                background: functionType === 'spiky' ? '#334155' : '#1e293b',
                                color: functionType === 'spiky' ? '#fff' : '#94a3b8',
                                fontSize: '12px',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: functionType === 'spiky' ? '1px solid #475569' : '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            Extreme Spikes
                        </button>
                    </div>
                </div>

                {/* Mode Toggle */}
                <div
                    style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '24px',
                        background: 'rgba(15, 23, 42, 0.5)',
                        padding: '4px',
                        borderRadius: '12px',
                    }}
                >
                    <button
                        onClick={() => setMode('riemann')}
                        style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 700,
                            background: mode === 'riemann' ? '#3b82f6' : 'transparent',
                            color: mode === 'riemann' ? '#fff' : '#94a3b8',
                            border: mode === 'riemann' ? '1px solid #60a5fa' : '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: mode === 'riemann' ? '0 0 20px rgba(59, 130, 246, 0.4)' : 'none',
                        }}
                    >
                        Riemann
                    </button>
                    <button
                        onClick={() => setMode('lebesgue')}
                        style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 700,
                            background: mode === 'lebesgue' ? '#3b82f6' : 'transparent',
                            color: mode === 'lebesgue' ? '#fff' : '#94a3b8',
                            border: mode === 'lebesgue' ? '1px solid #60a5fa' : '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: mode === 'lebesgue' ? '0 0 20px rgba(59, 130, 246, 0.4)' : 'none',
                        }}
                    >
                        Lebesgue
                    </button>
                </div>

                {/* Resolution Slider */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                        <label
                            style={{
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: '#94a3b8',
                                fontWeight: 700,
                            }}
                        >
                            Refinement (n)
                        </label>
                        <span style={{ color: '#60a5fa', fontFamily: 'monospace', fontSize: '14px' }}>{resolution}</span>
                    </div>
                    <input
                        type="range"
                        min="2"
                        max="30"
                        value={resolution}
                        onChange={(e) => setResolution(parseInt(e.target.value))}
                        style={{
                            width: '100%',
                            height: '6px',
                            background: '#334155',
                            borderRadius: '8px',
                            outline: 'none',
                            cursor: 'pointer',
                            accentColor: '#3b82f6',
                        }}
                    />
                </div>

                {/* Description */}
                <div
                    style={{
                        padding: '16px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        borderRadius: '12px',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: '#dbeafe',
                    }}
                >
                    <span style={{ display: 'block', fontWeight: 700, color: '#60a5fa', marginBottom: '4px' }}>
                        {description.title}
                    </span>
                    <span>{description.text}</span>
                </div>
            </div>

            {/* Legend */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    padding: '15px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontFamily: 'Inter, system-ui, sans-serif',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div
                        style={{
                            width: '16px',
                            height: '16px',
                            background: colorIndicator,
                            borderRadius: '2px',
                            boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)',
                        }}
                    />
                    <span>{legendText}</span>
                </div>
                <p
                    style={{
                        marginTop: '16px',
                        fontSize: '10px',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 700,
                    }}
                >
                    Drag: Rotate | Scroll: Zoom
                </p>
            </div>

            {/* 3D Canvas */}
            <Canvas
                camera={{ position: [20, 18, 20], fov: 60 }}
                style={{ width: '100%', height: '100%' }}
            >
                <color attach="background" args={['#020617']} />
                <Scene mode={mode} functionType={functionType} resolution={resolution} />
            </Canvas>
        </div>
    );
}
