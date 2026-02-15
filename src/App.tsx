import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import TopicPage from './components/TopicPage';
import SubtopicView from './components/SubtopicView';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="main-content">
          {/* Mobile Sidebar Toggle */}
          <button
            className="mobile-sidebar-toggle"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>

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
