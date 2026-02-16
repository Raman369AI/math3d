import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PreloadableComponent<T extends ComponentType<any>> = LazyExoticComponent<T> & {
    preload: () => Promise<{ default: T }>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithPreload<T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>
): PreloadableComponent<T> {
    const Component = lazy(factory) as PreloadableComponent<T>;
    Component.preload = factory;
    return Component;
}
