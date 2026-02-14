interface SubtopicCardPreviewProps {
    color: string;
}

export default function SubtopicCardPreview({ color }: SubtopicCardPreviewProps) {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                background: `radial-gradient(ellipse at 40% 50%, ${color}22 0%, transparent 70%), 
                     radial-gradient(ellipse at 70% 30%, ${color}15 0%, transparent 60%),
                     linear-gradient(135deg, #1a1a2e 0%, #12121a 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Animated floating shape */}
            <div
                style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '24px',
                    background: `linear-gradient(135deg, ${color}40, ${color}10)`,
                    border: `1px solid ${color}30`,
                    animation: 'float 4s ease-in-out infinite',
                    boxShadow: `0 0 40px ${color}15, inset 0 0 20px ${color}10`,
                }}
            />
            {/* Grid lines decoration */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `linear-gradient(${color}08 1px, transparent 1px), linear-gradient(90deg, ${color}08 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                }}
            />
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(8deg); }
        }
      `}</style>
        </div>
    );
}
