
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

// Import sub-components
import GeneralTab from './project-details/GeneralTab';
import OrgTab from './project-details/OrgTab';
import ScheduleTab from './project-details/ScheduleTab';
import PermissionsTab from './project-details/PermissionsTab';
import ContractTab from './project-details/ContractTab';
import ConfigTab from './project-details/ConfigTab';
import HistoryPanel from './project-details/HistoryPanel';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState('general');
  const [showHistory, setShowHistory] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Trong thực tế, bạn sẽ dùng projectId để gọi API lấy dữ liệu chi tiết
  // Ở đây chúng ta hiển thị ID để demo
  if (!projectId) return <div>Không tìm thấy ID dự án</div>;

  const tabs = [
    { id: 'general', label: 'Thông tin' },
    { id: 'org', label: 'Cơ cấu' },
    { id: 'schedule', label: 'Lịch làm' },
    { id: 'permissions', label: 'Phân quyền' },
    { id: 'contract', label: 'Hợp đồng' },
    { id: 'config', label: 'Cấu hình' },
  ];

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex h-full bg-slate-50/30 overflow-hidden relative">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl animate-in slide-in-from-top text-xs font-bold">
          Cập nhật thành công!
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        {/* Mobile Header Toolbar */}
        <div className="px-4 md:px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="min-w-0">
            <h2 className="text-base md:text-xl font-black text-slate-800 truncate tracking-tight">{projectId === 'P001' ? 'DA.2025.001' : projectId}</h2>
            <p className="text-[9px] md:text-xs text-slate-400 font-bold uppercase truncate">Cầu Máy Chai - Hải Phòng</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowHistory(!showHistory)} className={`p-2.5 rounded-xl border transition-all ${showHistory ? 'bg-blue-50 border-blue-200 text-blue-600' : 'text-slate-400 border-slate-200'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </button>
          </div>
        </div>

        {/* Tab Selection - Scrollable on mobile */}
        <div className="px-4 md:px-8 border-b border-slate-100 flex gap-6 md:gap-10 bg-white overflow-x-auto no-scrollbar shrink-0">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`}>
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>}
            </button>
          ))}
        </div>

        {/* Main Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {activeTab === 'general' && <GeneralTab onShowToast={handleShowToast} />}
          {activeTab === 'org' && <OrgTab onShowToast={handleShowToast} />}
          {activeTab === 'schedule' && <ScheduleTab />}
          {activeTab === 'permissions' && <PermissionsTab onShowToast={handleShowToast} />}
          {activeTab === 'contract' && <ContractTab />}
          {activeTab === 'config' && <ConfigTab />}
        </div>
      </div>

      {/* Responsive History Panel */}
      {showHistory && <HistoryPanel onClose={() => setShowHistory(false)} />}
    </div>
  );
};

export default ProjectDetails;
