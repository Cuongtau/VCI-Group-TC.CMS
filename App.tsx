
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ScheduleManager from './components/ScheduleManager';
import DailyLogManager from './components/DailyLogManager';
import ProjectDetails from './components/ProjectDetails';
import Login from './components/Login';

// Layout Component chứa Sidebar và Header cố định
const Layout = ({ onLogout }: { onLogout: () => void }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onLogout={onLogout} onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  return (
    <Routes>
      {/* --- Authentication Routes --- */}
      <Route path="/login" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
      
      {/* --- Protected App Routes --- */}
      <Route path="/" element={isLoggedIn ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" />}>
        {/* Redirect root to dashboard */}
        <Route index element={<Navigate to="/dashboard" />} />
        
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Project Group Routes */}
        <Route path="projects">
          <Route index element={<ProjectList />} />
          
          {/* Specific Project Context */}
          <Route path=":projectId">
            <Route index element={<ProjectDetails />} />
            <Route path="schedule" element={<ScheduleManager />} />
          </Route>
        </Route>

        {/* Daily Logs Route (Separated) */}
        <Route path="logs/:projectId" element={<DailyLogManager />} />
        
        {/* Other settings routes (Placeholder) */}
        <Route path="settings/*" element={<div className="p-8 text-center text-slate-500">Chức năng đang phát triển</div>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
}
