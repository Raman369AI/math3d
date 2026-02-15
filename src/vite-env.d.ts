/// <reference types="vite/client" />

export {};

declare global {
  interface Window {
    katex?: {
      render: (tex: string, element: HTMLElement | null, options?: Record<string, unknown>) => void;
    };
  }
}
