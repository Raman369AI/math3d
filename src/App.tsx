import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import TopicPage from './components/TopicPage';
import SubtopicView from './components/SubtopicView';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/:topicId" element={<TopicPage />} />
            <Route path="/:topicId/:subtopicId" element={<SubtopicView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
