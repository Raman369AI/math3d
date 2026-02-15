export {};

declare global {
  interface Window {
    katex?: {
      render: (tex: string, element: HTMLElement, options?: Record<string, unknown>) => void;
    };
  }
}
