import { NavLink } from 'react-router-dom';
import { topics } from '../data/topics';
import { X } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 99,
                        backdropFilter: 'blur(2px)'
                    }}
                />
            )}

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <NavLink to="/" className="sidebar-logo" onClick={onClose}>
                        <div className="sidebar-logo-icon">M³</div>
                        <div className="sidebar-logo-text">
                            <span className="sidebar-logo-title">Math3D</span>
                            <span className="sidebar-logo-subtitle">Visual Learning</span>
                        </div>
                    </NavLink>

                    {/* Close button for mobile */}
                    <button
                        className="sidebar-close-btn"
                        onClick={onClose}
                        aria-label="Close sidebar"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'none', // Hidden by default, shown in media query
                            marginLeft: 'auto'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/"
                        end
                        onClick={onClose}
                        className={({ isActive }) =>
                            `sidebar-nav-item ${isActive ? 'active' : ''}`
                        }
                        style={{ '--item-color': '#a29bfe' } as React.CSSProperties}
                    >
                        <span className="sidebar-nav-icon">🏠</span>
                        <span className="sidebar-nav-label">Home</span>
                    </NavLink>

                    {topics.map((topic) => (
                        <NavLink
                            key={topic.id}
                            to={`/${topic.id}`}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `sidebar-nav-item ${isActive ? 'active' : ''}`
                            }
                            style={{ '--item-color': topic.color } as React.CSSProperties}
                        >
                            <span className="sidebar-nav-icon">{topic.icon}</span>
                            <span className="sidebar-nav-label">{topic.title}</span>
                            <span className="sidebar-nav-count">{topic.subtopics.length}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <p className="sidebar-footer-text">
                        Interactive 3D Mathematics
                    </p>
                </div>
            </aside>
        </>
    );
}
