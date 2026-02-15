import { useEffect, useRef } from 'react';
import { useKatex } from '../hooks/useKatex';

interface LatexProps {
    formula: string;
    display?: boolean;
}

export function Latex({ formula, display = false }: LatexProps) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const katexLoaded = useKatex();

    useEffect(() => {
        if (containerRef.current && katexLoaded && window.katex) {
            window.katex.render(formula, containerRef.current, {
                throwOnError: false,
                displayMode: display,
            });
        }
    }, [formula, display, katexLoaded]);

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
