import { useParams, Link } from 'react-router-dom';
import { getTopicById } from '../data/topics';
import SubtopicCardPreview from './SubtopicCardPreview';

export default function TopicPage() {
    const { topicId } = useParams<{ topicId: string }>();
    const topic = topicId ? getTopicById(topicId) : undefined;

    if (!topic) {
        return (
            <div className="topic-page">
                <h1 className="topic-page-title">Topic Not Found</h1>
                <p className="topic-page-description">The requested topic does not exist.</p>
            </div>
        );
    }

    return (
        <div className="topic-page">
            <div className="topic-page-header fade-in-up">
                <div className="topic-page-breadcrumb">
                    <Link to="/">Home</Link>
                    <span>›</span>
                    <span>{topic.title}</span>
                </div>
                <h1 className="topic-page-title" style={{ color: topic.color }}>
                    {topic.icon} {topic.title}
                </h1>
                <p className="topic-page-description">
                    Explore interactive 3D visualizations for {topic.title.toLowerCase()} concepts.
                    Click any card to launch the full visualization.
                </p>
            </div>

            <div className="subtopic-grid">
                {topic.subtopics.map((subtopic, index) => (
                    <Link
                        key={subtopic.id}
                        to={`/${topic.id}/${subtopic.id}`}
                        className={`subtopic-card fade-in-up stagger-${index + 1}`}
                    >
                        <div className="subtopic-card-preview">
                            <SubtopicCardPreview color={topic.color} />
                        </div>
                        <div className="subtopic-card-body">
                            <h3 className="subtopic-card-title">{subtopic.title}</h3>
                            <p className="subtopic-card-description">{subtopic.description}</p>
                        </div>
                        <div className="subtopic-card-footer">
                            <span className="subtopic-card-tag">Interactive 3D</span>
                            <span className="subtopic-card-open">
                                Explore →
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
