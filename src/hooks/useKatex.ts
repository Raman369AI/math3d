import { useState, useEffect } from 'react';

declare global {
    interface Window {
        katex?: {
            render: (tex: string, element: HTMLElement, options?: Record<string, unknown>) => void;
        };
    }
}

export const useKatex = () => {
    const [isLoaded, setIsLoaded] = useState(() => typeof window !== 'undefined' && !!window.katex);

    useEffect(() => {
        if (isLoaded) return;

        if (window.katex) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsLoaded(true);
            return;
        }

        const linkId = 'katex-css';
        if (!document.getElementById(linkId)) {
            const link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
            document.head.appendChild(link);
        }

        const scriptId = 'katex-js';
        let script = document.getElementById(scriptId) as HTMLScriptElement;

        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
            document.head.appendChild(script);
        }

        const onLoad = () => setIsLoaded(true);
        script.addEventListener('load', onLoad);

        return () => {
            script.removeEventListener('load', onLoad);
        };
    }, [isLoaded]);

    return isLoaded;
};
