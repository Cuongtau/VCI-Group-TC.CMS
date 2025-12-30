
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Task, Project, TaskStatus } from '../types';
import { getMockTasks, mockProjects } from '../services/dataService';
import TaskTable from './TaskTable';
import GanttChart from './GanttChart';
import { Icons } from '../constants';

const ScheduleManager: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeView, setActiveView] = useState<'split' | 'table' | 'gantt'>('table');

  useEffect(() => {
    if (!projectId) return;

    // Detect mobile and set default view
    const isMobile = window.innerWidth < 1024;
    setActiveView(isMobile ? 'table' : 'split');
    
    setTasks(getMockTasks(projectId));
    setProject(mockProjects.find(p => p.id === projectId) || null);
  }, [projectId]);

  const handleToggleExpand = (taskId: string) => {
    const findAndToggle = (taskList: Task[], id: string): Task[] => {
      return taskList.map(t => {
        if (t.id === id) return { ...t, isExpanded: !t.isExpanded };
        if (t.subTasks) return { ...t, subTasks: findAndToggle(t.subTasks, id) };
        return t;
      });
    };
    setTasks(prev => findAndToggle(prev, taskId));
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    const findAndUpdate = (taskList: Task[], id: string, updates: Partial<Task>): Task[] => {
      return taskList.map(t => {
        if (t.id === id) return { ...t, ...updates };
        if (t.subTasks) return { ...t, subTasks: findAndUpdate(t.subTasks, id, updates) };
        return t;
      });
    };
    setTasks(prev => findAndUpdate(prev, taskId, updates));
  };

  const handleAddTask = (parentId: string | null) => {
    if (!projectId) return;
    const newTask: Task = {
      id: `T${Date.now()}`, projectId, name: 'Hạng mục mới', code: 'HM-' + Math.floor(Math.random() * 1000),
      level: 1, parentId: parentId, startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0], progress: 0, status: TaskStatus.NOT_STARTED, assignee: 'Đang chờ',
    };
    if (!parentId) {
      setTasks(prev => [...prev, newTask]);
    } else {
      const addToParent = (taskList: Task[]): Task[] => {
        return taskList.map(t => {
          if (t.id === parentId) return { ...t, isExpanded: true, subTasks: [...(t.subTasks || []), { ...newTask, level: t.level + 1 }] };
          if (t.subTasks) return { ...t, subTasks: addToParent(t.subTasks) };
          return t;
        });
      };
      setTasks(prev => addToParent(prev));
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const removeFromList = (taskList: Task[]): Task[] => {
      return taskList.filter(t => t.id !== taskId).map(t => ({ ...t, subTasks: t.subTasks ? removeFromList(t.subTasks) : undefined }));
    };
    if (confirm('Xóa hạng mục này?')) setTasks(prev => removeFromList(prev));
  };

  if (!projectId) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-slate-400 mb-4"><Icons.Project /></div>
      <h3 className="text-lg font-bold text-slate-800">Không tìm thấy dự án</h3>
      <Link to="/projects" className="mt-4 text-blue-600 font-bold hover:underline">Quay lại danh sách</Link>
    </div>
  );

  if (!project) return <div className="flex-1 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div></div>;

  return (
    <div className={`h-full flex flex-col bg-slate-100 ${isFullScreen ? 'fixed inset-0 z-[60]' : ''}`}>
      {/* Header Info - Desktop: Full / Mobile: Compact */}
      <div className="bg-white px-4 md:px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 md:items-center md:justify-between sticky top-0 z-40 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-700 rounded-xl md:rounded-2xl flex items-center justify-center text-white shrink-0">
            <Icons.Progress />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-xl font-black text-slate-800 tracking-tight truncate">{project.name}</h2>
              <span className="hidden sm:inline-block px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold border border-slate-200 uppercase">{project.code}</span>
            </div>
            <p className="text-[10px] md:text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Tiến độ tổng: 65% • {project.startDate} — {project.endDate}</p>
          </div>
        </div>

        {/* View Switcher - Scrollable on mobile */}
        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveView('split')}
            className={`hidden lg:block px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeView === 'split' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
          >
            CHIA ĐÔI
          </button>
          <button 
            onClick={() => setActiveView('table')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${activeView === 'table' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
          >
            DANH SÁCH
          </button>
          <button 
            onClick={() => setActiveView('gantt')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${activeView === 'gantt' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
          >
            BIỂU ĐỒ
          </button>
        </div>
      </div>

      {/* Workspace - Desktop: Split / Mobile: Full Active View */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row p-4 md:p-6 gap-4 md:gap-6">
        {/* Task List Section */}
        {(activeView === 'split' || activeView === 'table') && (
          <div className={`${activeView === 'table' ? 'w-full' : 'lg:w-[45%] w-full'} flex flex-col bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full`}>
            <div className="px-4 md:px-6 py-3 md:py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Danh sách hạng mục</span>
              <button onClick={() => handleAddTask(null)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Icons.Plus /></button>
            </div>
            <div className="flex-1 overflow-auto">
              <TaskTable tasks={tasks} onToggleExpand={handleToggleExpand} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} onAddTask={handleAddTask} />
            </div>
          </div>
        )}

        {/* Gantt Section */}
        {(activeView === 'split' || activeView === 'gantt') && (
          <div className={`${activeView === 'gantt' ? 'w-full' : 'flex-1'} flex flex-col bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full`}>
            <div className="px-4 md:px-6 py-3 md:py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biểu đồ Gantt</span>
              <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> KẾ HOẠCH
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <GanttChart tasks={tasks} startDate={project.startDate} endDate={project.endDate} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Action Button */}
      <div className="lg:hidden p-4 bg-white border-t border-slate-100 sticky bottom-0">
        <button className="w-full py-3 bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200">
          Lưu tất cả thay đổi
        </button>
      </div>
    </div>
  );
};

export default ScheduleManager;
