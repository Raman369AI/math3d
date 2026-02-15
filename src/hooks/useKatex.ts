import { useState, useEffect } from 'react';

let isLoading = false;
let isLoaded = false;
const listeners: (() => void)[] = [];

// Check if window.katex is already available
if (typeof window !== 'undefined' && window.katex) {
    isLoaded = true;
}

function notify() {
    const currentListeners = [...listeners];
    listeners.length = 0;
    currentListeners.forEach((listener) => listener());
}

/**
 * Hook to load KaTeX script and stylesheet from CDN.
 * Returns boolean indicating if KaTeX is loaded and ready.
 * Implements a singleton pattern with event subscription.
 */
export function useKatex() {
    const [ready, setReady] = useState(isLoaded);

    useEffect(() => {
        if (isLoaded) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setReady(true);
            return;
        }

        const onLoaded = () => setReady(true);
        listeners.push(onLoaded);

        if (!isLoading) {
            isLoading = true;

            // Load CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
            link.integrity = 'sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);

            // Load JS
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
            script.integrity = 'sha384-cpW21h6RZv/phavutF+AuVYrr+dA8xD9zs6FwLpaCct6O9ctzYFfFr4dgmgccOTx';
            script.crossOrigin = 'anonymous';
            script.onload = () => {
                isLoaded = true;
                isLoading = false;
                notify();
            };
            script.onerror = () => {
                console.error("Failed to load KaTeX");
                isLoading = false;
                // Should we verify failure? Maybe notify listeners with error?
                // For now, keep as is.
            };
            document.head.appendChild(script);
        }

        return () => {
            const index = listeners.indexOf(onLoaded);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, []);

    return ready;
}
