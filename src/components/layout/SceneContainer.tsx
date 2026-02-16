import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Menu } from 'lucide-react';

interface SceneContainerProps {
    children: React.ReactNode;
    controls?: React.ReactNode;
    onBack?: () => void; // Optional override, defaults to Link
    backUrl?: string;    // Defaults to '/topicId'
}

export function SceneContainer({
    children,
    controls,
    backUrl
}: SceneContainerProps) {
    const [showControls, setShowControls] = useState(true);

    return (
        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            background: '#0b0f19',
            overflow: 'hidden'
        }}>
            {/* 1. Global Navigation Overlay (Top Left) */}
            <nav style={{
                position: 'absolute',
                top: 20,
                left: 20,
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                pointerEvents: 'none' // Let clicks pass through to canvas when not on buttons
            }}>
                {backUrl && (
                    <Link
                        to={backUrl}
                        style={{
                            pointerEvents: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'rgba(15, 23, 42, 0.8)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(148, 163, 184, 0.1)',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        aria-label="Back"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                )}

                {/* Title Breadcrumb - Only visible on larger screens or if space permits? 
            For now, let's keep it minimal to focus on the scene. 
            Actually, let's show it. 
        */}
                {/* 
        <div style={{
           pointerEvents: 'auto',
           background: 'rgba(15, 23, 42, 0.8)',
           backdropFilter: 'blur(8px)',
           border: '1px solid rgba(148, 163, 184, 0.1)',
           borderRadius: '12px',
           padding: '8px 16px',
           color: 'white'
        }}>
           <h1 style={{fontSize: '14px', fontWeight: 600}}>{title}</h1>
        </div>
        */}
            </nav>

            {/* 2. Main Content (Canvas) */}
            <main style={{ width: '100%', height: '100%' }}>
                {children}
            </main>

            {/* 3. Controls Sidebar (Top Right / Right Slide-in) */}
            {controls && (
                <>
                    {/* Toggle Button (Mobile/Desktop) */}
                    <button
                        onClick={() => setShowControls(!showControls)}
                        style={{
                            position: 'absolute',
                            top: 20,
                            right: 20,
                            zIndex: 50,
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            background: showControls ? 'rgba(99, 102, 241, 1)' : 'rgba(15, 23, 42, 0.8)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(148, 163, 184, 0.1)',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <Menu size={20} />
                    </button>

                    {/* Sidebar Content */}
                    {showControls && (
                        <aside style={{
                            position: 'absolute',
                            top: 70, // Below the toggle button
                            right: 20,
                            width: '320px',
                            maxHeight: 'calc(100vh - 90px)',
                            zIndex: 40,
                            overflowY: 'auto',
                            // Animation could be added here
                        }}>
                            {controls}
                        </aside>
                    )}
                </>
            )}
        </div>
    );
}
