// @vitest-environment jsdom
import { render, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BanachTarski from './BanachTarski';
import React, { Profiler, useEffect, useRef } from 'react';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock @react-three/fiber
vi.mock('@react-three/fiber', async () => {
  const actual = await vi.importActual('@react-three/fiber');
  return {
    ...actual,
    // Mock Canvas to just render children, avoiding WebGL issues in jsdom
    Canvas: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    // Mock useFrame to simulate animation loop
    useFrame: (callback: (state: any, delta: number) => void) => {
      const savedCallback = useRef(callback);

      // Remember the latest callback.
      useEffect(() => {
        savedCallback.current = callback;
      }, [callback]);

      useEffect(() => {
        const interval = setInterval(() => {
          try {
            savedCallback.current({ clock: { elapsedTime: 0 } } as any, 0.016);
          } catch (e) {
            // Ignore errors
          }
        }, 16);
        return () => clearInterval(interval);
      }, []);
    },
    useThree: () => ({ camera: {}, gl: {}, scene: {} }),
  };
});

// Mock @react-three/drei
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
}));

describe('BanachTarski Performance', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should have low render count during animation (optimized)', async () => {
    let renderCount = 0;
    const onRender = (
      id: string,
      phase: 'mount' | 'update' | 'nested-update',
      actualDuration: number,
      baseDuration: number,
      startTime: number,
      commitTime: number
    ) => {
      renderCount++;
    };

    const { getByText } = render(
      <Profiler id="BanachTarski" onRender={onRender}>
        <BanachTarski />
      </Profiler>
    );

    // Initial render count
    const initialRenderCount = renderCount;
    console.log('Initial render count:', initialRenderCount);

    // Click the split button to start animation
    const splitButton = getByText('Decompose & Double');

    await act(async () => {
        fireEvent.click(splitButton);
    });

    console.log('Render count after click:', renderCount);

    // Advance time frame by frame
    for (let i = 0; i < 20; i++) {
        await act(async () => {
            vi.advanceTimersByTime(20);
        });
    }

    console.log('Final render count:', renderCount);

    // We expect MINIMAL renders (e.g. initial + 1 for split toggle)
    // The animation should happen via refs and not trigger React renders.
    expect(renderCount).toBeLessThan(initialRenderCount + 5);
  });
});
