
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
import ConfirmModal from './components/common/ConfirmModal';

// Resources
import MaterialManager from './components/resources/MaterialManager';
import EquipmentManager from './components/resources/EquipmentManager';

// Settings
import UnitManager from './components/settings/UnitManager';
import CategoryManager from './components/settings/CategoryManager';

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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('tc_session');
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <Routes>
        {/* --- Authentication Routes --- */}
        <Route path="/login" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
        
        {/* --- Protected App Routes --- */}
        <Route path="/" element={isLoggedIn ? <Layout onLogout={handleLogoutClick} /> : <Navigate to="/login" />}>
          {/* Redirect root to dashboard */}
          <Route index element={<Navigate to="/dashboard" />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Project Group Routes - Start with /projects */}
          <Route path="projects">
            <Route index element={<ProjectList />} />
            <Route path=":projectId">
              <Route index element={<ProjectDetails />} />
              <Route path="schedule" element={<ScheduleManager />} />
            </Route>
          </Route>

          {/* Daily Logs Route */}
          <Route path="logs" element={<ProjectList />} />
          <Route path="logs/:projectId" element={<DailyLogManager />} />
          
          {/* Resources Routes */}
          <Route path="resources">
              <Route path="materials" element={<MaterialManager />} />
              <Route path="equipment" element={<EquipmentManager />} />
          </Route>

          {/* Settings Routes */}
          <Route path="settings">
              <Route path="units" element={<UnitManager />} />
              <Route path="categories" element={<CategoryManager />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>

      <ConfirmModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?"
        confirmLabel="Đăng xuất"
        type="danger"
      />
    </>
  );
}
