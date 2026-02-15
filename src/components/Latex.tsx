import { useEffect, useRef } from 'react';

interface LatexProps {
    formula: string;
    display?: boolean;
}

export function Latex({ formula, display = false }: LatexProps) {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (containerRef.current && window.katex) {
            window.katex.render(formula, containerRef.current, {
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
