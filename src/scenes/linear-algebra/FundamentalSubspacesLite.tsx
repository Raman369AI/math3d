import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Arrow } from '../../components/3d/Arrow';
import { Label } from '../../components/3d/Label';

/* Simplified data */
const DATA = {
    x: [3, 3, 3] as [number, number, number],
    x_row: [1, 4, 2] as [number, number, number],
    x_null: [2, -1, 1] as [number, number, number],
};

type ViewMode = 'domain' | 'codomain';

/* Domain view - simplified */
function DomainView() {
    return (
        <group>
            {/* Input vector x */}
            <Arrow direction={DATA.x} color="#eab308" lineWidth={3} />
            <Label text="x=[3,3,3]" position={[3.5, 3.5, 3]} color="#facc15" />

            {/* Row space component */}
            <Arrow direction={DATA.x_row} color="#86efac" lineWidth={3} />
            <Label text="x_r=[1,4,2]" position={[1, 5, 2]} color="#86efac" />

            {/* Null space component */}
            <Arrow direction={DATA.x_null} color="#fca5a5" lineWidth={3} />
            <Label text="x_n=[2,-1,1]" position={[3, -1.5, 1]} color="#fca5a5" />
        </group>
    );
}

/* Scene base */
function SceneBase() {
    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 10]} intensity={0.5} />
            <axesHelper args={[5]} />
        </>
    );
}

/* Info panel */
function InfoPanel({ mode, onModeChange }: { mode: ViewMode; onModeChange: (m: ViewMode) => void }) {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '360px',
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
        }}>
            <div>
                <h2 style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #818cf8, #34d399)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '6px',
                }}>
                    Fundamental Subspaces (Optimized)
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
                    Simplified view showing vector decomposition.
                </p>
            </div>

            <div style={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '16px',
            }}>
                <p style={{ fontSize: '14px', fontFamily: 'JetBrains Mono', color: '#e2e8f0' }}>
                    x = [3,3,3]<br />
                    x_r = [1,4,2] (row space)<br />
                    x_n = [2,-1,1] (null space)
                </p>
            </div>

            <div style={{ display: 'flex', gap: '4px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '4px' }}>
                <button
                    onClick={() => onModeChange('domain')}
                    style={{
                        flex: 1,
                        padding: '8px 0',
                        fontSize: '13px',
                        fontWeight: 600,
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: mode === 'domain' ? '#4f46e5' : 'transparent',
                        color: mode === 'domain' ? '#fff' : '#94a3b8',
                    }}
                >
                    Domain (ℝ³)
                </button>
            </div>
        </div>
    );
}

/* Main component */
export default function FundamentalSpacesOptimized() {
    const [mode, setMode] = useState<ViewMode>('domain');

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: '#0f172a' }}>
            <Canvas
                camera={{ position: [8, 8, 8], fov: 50 }}
                dpr={[1, 1.5]}
                gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
                aria-label="Fundamental Subspaces Lite"
            >
                <SceneBase />
                <DomainView />
                <OrbitControls />
            </Canvas>

            <InfoPanel mode={mode} onModeChange={setMode} />
        </div>
    );
}
