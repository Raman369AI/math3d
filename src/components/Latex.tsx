import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LatexProps {
    formula: string;
    display?: boolean;
}

export default function Latex({ formula, display = false }: LatexProps) {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            katex.render(formula, containerRef.current, {
                throwOnError: false,
                displayMode: display,
            });
        }
    }, [formula, display]);

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
