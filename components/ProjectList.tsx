
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockProjects } from '../services/dataService';
import { Icons } from '../constants';

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const projects = mockProjects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Danh mục Dự án</h2>
          <p className="text-sm text-slate-500 mt-1">Theo dõi toàn bộ danh sách các dự án đang triển khai.</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-3">
           <div className="relative group w-full md:w-auto md:flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Icons.Search />
            </span>
            <input 
              type="text" 
              placeholder="Tìm tên hoặc mã dự án..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 w-full outline-none transition-all shadow-sm"
            />
          </div>
          <button className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
            <Icons.Plus />
            Dự án mới
          </button>
        </div>
      </div>

      {/* Filter Tabs - Horizontal Scroll on Mobile */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto no-scrollbar scroll-smooth">
        {[
          { id: 'all', label: 'Tất cả', count: projects.length },
          { id: 'active', label: 'Đang thi công', count: 12 },
          { id: 'completed', label: 'Hoàn thành', count: 5 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`pb-3 text-xs md:text-sm font-bold transition-all relative whitespace-nowrap ${
              filter === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] md:text-[10px] ${filter === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
              {tab.count}
            </span>
            {filter === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {projects.map((project) => (
          <div key={project.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full shadow-sm">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-widest bg-blue-50 text-blue-600 px-2 py-1 rounded-lg w-fit mb-2">
                    {project.code}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                    {project.name}
                  </h3>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                 <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Chỉ huy trưởng</p>
                      <p className="text-xs font-semibold text-slate-700">{project.manager}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Thời gian</p>
                      <p className="text-xs font-semibold text-slate-700">{project.startDate} — {project.endDate}</p>
                    </div>
                 </div>
              </div>
              
              <p className="text-xs md:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-100 mt-auto">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tiến độ tổng thể: <span className="text-blue-600 font-black">65.8%</span></span>
                <div className="flex -space-x-1.5">
                  {[1, 2, 3].map(i => (
                    <img key={i} src={`https://picsum.photos/24/24?sig=${project.id+i}`} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" alt="Member" />
                  ))}
                </div>
              </div>

              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-5">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '65.8%' }}></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="bg-white border border-slate-200 py-3 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Icons.Project /> Chi tiết
                </button>
                <button 
                  onClick={() => navigate(`/projects/${project.id}/schedule`)}
                  className="bg-blue-600 border border-transparent py-3 rounded-xl text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Icons.Progress /> Tiến độ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
