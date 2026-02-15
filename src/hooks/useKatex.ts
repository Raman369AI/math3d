import { useState, useEffect } from 'react';

/**
 * Hook to load KaTeX script and stylesheet.
 * Returns boolean indicating if KaTeX is loaded and ready.
 */
export function useKatex() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Create link element for CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
        document.head.appendChild(link);

        // Create script element for JS
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
        script.onload = () => setIsLoaded(true);
        script.onerror = () => {
            console.error("Failed to load KaTeX");
        };
        document.head.appendChild(script);

        // Cleanup on unmount
        return () => {
            document.head.removeChild(link);
            document.head.removeChild(script);
        };
    }, []);

    return isLoaded;
}
