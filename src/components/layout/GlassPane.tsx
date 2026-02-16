import React from 'react';

interface GlassPaneProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export function GlassPane({ children, className = '', style = {} }: GlassPaneProps) {
    const baseStyle: React.CSSProperties = {
        background: 'rgba(15, 23, 42, 0.9)', // Slate-900 with opacity
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        color: 'white',
        ...style,
    };

    return (
        <div className={`glass-pane ${className}`} style={baseStyle}>
            {children}
        </div>
    );
}
