import { useEffect, useRef } from 'react';
import { useKatex } from '../hooks/useKatex';

declare global {
    interface Window {
        katex?: {
            render: (tex: string, element: HTMLElement, options?: Record<string, unknown>) => void;
        };
    }
}

interface LatexProps {
    formula: string;
    display?: boolean;
    fallback?: React.ReactNode;
}

export default function Latex({ formula, display = false, fallback }: LatexProps) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const isLoaded = useKatex();

    useEffect(() => {
        if (containerRef.current && isLoaded && window.katex) {
            window.katex.render(formula, containerRef.current, {
                throwOnError: false,
                displayMode: display,
            });
        }
    }, [formula, display, isLoaded]);

    if (!isLoaded) {
        return fallback !== undefined ? <>{fallback}</> : <span style={{ color: '#94a3b8' }}>Loading equation...</span>;
    }

    return (
        <span
            ref={containerRef}
            style={{
                display: display ? 'block' : 'inline-block',
                margin: display ? '16px 0' : '0',
                textAlign: display ? 'center' : 'left',
                overflowX: 'auto',
            }}
        />
    );
}
