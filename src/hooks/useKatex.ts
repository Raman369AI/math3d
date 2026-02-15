import { useState, useEffect } from 'react';

const KATEX_CSS = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
const KATEX_JS = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
const KATEX_CSS_SRI = 'sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn';
const KATEX_JS_SRI = 'sha384-cpW21h6RZv/phavutF+AuVYrr+dA8xD9zs6FwLpaCct6O9ctzYFfFr4dgmgccOTx';

export function useKatex() {
    const [katexLoaded, setKatexLoaded] = useState(!!window.katex);

    useEffect(() => {
        if (katexLoaded) return;

        if (window.katex) {
            // Use setTimeout to avoid synchronous state update warning
            setTimeout(() => setKatexLoaded(true), 0);
            return;
        }

        const existingScript = document.querySelector(`script[src="${KATEX_JS}"]`);

        if (existingScript) {
             existingScript.addEventListener('load', () => setKatexLoaded(true));
             return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = KATEX_CSS;
        link.integrity = KATEX_CSS_SRI;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = KATEX_JS;
        script.integrity = KATEX_JS_SRI;
        script.crossOrigin = 'anonymous';
        script.onload = () => setKatexLoaded(true);
        document.head.appendChild(script);

    }, [katexLoaded]);

    return katexLoaded;
}
