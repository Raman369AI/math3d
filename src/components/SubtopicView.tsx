import { Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTopicById, getSubtopicById } from '../data/topics';

function LoadingFallback({ color = '#6c5ce7' }: { color?: string }) {
    return (
        <div className="loading-screen">
            <div
                className="loading-spinner"
                style={{ borderTopColor: color }}
            />
            <span className="loading-text" style={{ color: '#94a3b8' }}>
                Loading visualization...
            </span>
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

    // Pass the standard layout props to the scene? 
    // No, the Scene itself should implement SceneContainer. 
    // SubtopicView just acts as the mounter.

    return (
        <div className="subtopic-view" style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0
        }}>
            <Suspense fallback={<LoadingFallback color={topic.color} />}>
                <SceneComponent />
            </Suspense>
        </div>
    );
}
