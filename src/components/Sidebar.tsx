import { NavLink } from 'react-router-dom';
import { topics } from '../data/topics';

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <NavLink to="/" className="sidebar-logo">
                    <div className="sidebar-logo-icon">M³</div>
                    <div className="sidebar-logo-text">
                        <span className="sidebar-logo-title">Math3D</span>
                        <span className="sidebar-logo-subtitle">Visual Learning</span>
                    </div>
                </NavLink>
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/"
                    end
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
    );
}
