
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ScheduleManager from './components/ScheduleManager';
import DailyLogManager from './components/DailyLogManager';
import ProjectDetails from './components/ProjectDetails';
import Login from './components/Login';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('P001');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check for saved session
  useEffect(() => {
    const session = localStorage.getItem('tc_session');
    if (session === 'active') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('tc_session', 'active');
  };

  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      setIsLoggedIn(false);
      localStorage.removeItem('tc_session');
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'project_details':
        return <ProjectDetails projectId={selectedProjectId || 'P001'} />;
      case 'projects':
        return <ProjectList onSelectProject={(id) => { setSelectedProjectId(id); setActiveTab('progress'); }} />;
      case 'progress':
        return selectedProjectId ? 
          <ScheduleManager projectId={selectedProjectId} /> : 
          <div className="flex-1 flex items-center justify-center p-4 md:p-8 text-center text-slate-500 bg-white m-4 md:m-6 rounded-2xl border border-dashed border-slate-300">
            <div>
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Chưa chọn dự án</h3>
              <p className="max-w-xs mt-1 text-sm">Vui lòng chọn một dự án từ danh sách để xem chi tiết tiến độ thi công.</p>
              <button 
                onClick={() => setActiveTab('projects')}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-200"
              >
                Đến Danh sách Dự án
              </button>
            </div>
          </div>;
      case 'logs':
        return <DailyLogManager selectedProjectId={selectedProjectId} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-inter relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - Responsive */}
      <div className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header activeTab={activeTab} onLogout={handleLogout} onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
