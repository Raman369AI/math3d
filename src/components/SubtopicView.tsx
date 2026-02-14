import { Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTopicById, getSubtopicById } from '../data/topics';

function LoadingFallback() {
    return (
        <div className="loading-screen">
            <div className="loading-spinner" />
            <span className="loading-text">Loading visualization…</span>
        </div>
    );
}

export default function SubtopicView() {
    const { topicId, subtopicId } = useParams<{ topicId: string; subtopicId: string }>();
    const topic = topicId ? getTopicById(topicId) : undefined;
    const subtopic = topicId && subtopicId ? getSubtopicById(topicId, subtopicId) : undefined;

    if (!topic || !subtopic) {
        return (
            <div className="topic-page">
                <h1 className="topic-page-title">Visualization Not Found</h1>
                <p className="topic-page-description">The requested visualization does not exist.</p>
                <Link to="/" className="subtopic-view-back" style={{ marginTop: 16 }}>
                    ← Back
                </Link>
            </div>
        );
    }

    const SceneComponent = subtopic.component;

    return (
        <div className="subtopic-view">
            <div className="subtopic-view-header">
                <Link to={`/${topic.id}`} className="subtopic-view-back">
                    ←
                </Link>
                <span className="subtopic-view-title" style={{ color: topic.color }}>
                    {topic.icon} {subtopic.title}
                </span>
            </div>
            <div className="subtopic-view-canvas">
                <Suspense fallback={<LoadingFallback />}>
                    <SceneComponent />
                </Suspense>
            </div>
        </div>
    );
}
