
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DailyLog, Task } from '../types';
import { getMockTasks } from '../services/dataService';
import { Icons } from '../constants';

const DailyLogManager: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [newLogDate, setNewLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [logContent, setLogContent] = useState('');
  const [logProgress, setLogProgress] = useState(0);

  const [logs, setLogs] = useState<DailyLog[]>([
    {
      id: 'L1',
      taskId: 'T1.1.2',
      date: '2024-03-20',
      content: 'Hoàn thành khoan 3 cọc tại mố cầu A1. Thời tiết nắng ráo, máy móc hoạt động tốt.',
      actualProgress: 100,
      notes: 'Cần kiểm tra lại cốt thép cọc số 4.'
    },
    {
      id: 'L2',
      taskId: 'T2.2',
      date: '2024-05-10',
      content: 'Đang lắp đặt ván khuôn dầm sàn tầng 2. Nhân lực 15 người.',
      actualProgress: 45,
      notes: 'Thiếu một ít vật tư ván khuôn, đã đặt bổ sung.'
    }
  ]);

  useEffect(() => {
    if (projectId) {
        // Flatten tasks for dropdown
        const allTasks: Task[] = [];
        const flatten = (list: Task[]) => {
            list.forEach(t => {
                allTasks.push(t);
                if (t.subTasks) flatten(t.subTasks);
            });
        };
        flatten(getMockTasks(projectId));
        setTasks(allTasks);
    }
  }, [projectId]);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId) return;

    const newLog: DailyLog = {
        id: `L${Date.now()}`,
        taskId: selectedTaskId,
        date: newLogDate,
        content: logContent,
        actualProgress: logProgress,
        notes: ''
    };

    setLogs([newLog, ...logs]);
    setShowAddModal(false);
    // Reset form
    setLogContent('');
    setLogProgress(0);
  };

  const getTaskName = (id: string) => tasks.find(t => t.id === id)?.name || id;

  if (!projectId) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-slate-400 mb-4"><Icons.Project /></div>
      <h3 className="text-lg font-bold text-slate-800">Không tìm thấy dự án</h3>
      <Link to="/logs" className="mt-4 text-blue-600 font-bold hover:underline">Quay lại danh sách</Link>
    </div>
  );

  return (
    <div className="p-6 h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
            <Link to="/logs" className="text-slate-400 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </Link>
            <h2 className="text-xl font-bold text-slate-800">Nhật ký tiến độ thi công</h2>
        </div>
        <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Icons.Plus />
          Viết nhật ký
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex overflow-hidden">
        {/* Date Selector Sidebar */}
        <div className="w-64 border-r border-slate-100 p-4 bg-slate-50/50 flex flex-col hidden md:flex">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Lịch trình thi công</h3>
          <div className="space-y-1 flex-1 overflow-y-auto">
            {['2024-05-15', '2024-05-14', '2024-05-13', '2024-05-12', '2024-05-11', '2024-05-10', '2024-03-20'].map(date => (
              <button key={date} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${logs.some(l => l.date === date) ? 'text-blue-700 font-bold bg-blue-50' : 'hover:bg-white text-slate-600'}`}>
                {date}
                {logs.some(l => l.date === date) && <span className="float-right w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>}
              </button>
            ))}
          </div>
        </div>

        {/* Log Details Area */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-8">
            {logs.length > 0 ? logs.map(log => (
              <div key={log.id} className="relative pl-8 pb-8 border-l-2 border-slate-100 last:border-0 animate-in slide-in-from-bottom-2">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm"></div>
                
                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded uppercase tracking-wider">{getTaskName(log.taskId)}</span>
                    <span className="text-xs font-bold text-slate-400">{log.date}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">{log.content}</p>
                  
                  {/* Fake Images */}
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
                    {[1, 2].map(i => (
                      <div key={i} className="relative group">
                        <img src={`https://picsum.photos/200/120?sig=${log.id+i}`} className="w-32 h-20 rounded-lg object-cover border border-slate-100 cursor-pointer" alt="Jobsite" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Tiến độ thực tế</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${log.actualProgress}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-emerald-600">{log.actualProgress}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Ghi chú</p>
                      <p className="text-sm text-slate-600 truncate italic">{log.notes || 'Không có ghi chú'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
                <div className="text-center py-10">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Icons.Edit />
                    </div>
                    <p className="text-slate-500">Chưa có nhật ký nào cho dự án này.</p>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD LOG MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">Thêm Nhật ký Thi công</h3>
                    <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <form onSubmit={handleAddLog} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase">Ngày báo cáo</label>
                            <input 
                                type="date" 
                                value={newLogDate}
                                onChange={(e) => setNewLogDate(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase">Tiến độ (%)</label>
                            <input 
                                type="number" 
                                min="0" max="100"
                                value={logProgress}
                                onChange={(e) => setLogProgress(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase">Hạng mục công việc <span className="text-red-500">*</span></label>
                        <select 
                            value={selectedTaskId}
                            onChange={(e) => setSelectedTaskId(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        >
                            <option value="">-- Chọn hạng mục --</option>
                            {tasks.map(t => (
                                <option key={t.id} value={t.id}>{t.code} - {t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase">Nội dung công việc</label>
                        <textarea 
                            value={logContent}
                            onChange={(e) => setLogContent(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                            placeholder="Mô tả chi tiết công việc, máy móc, nhân lực..."
                            required
                        ></textarea>
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase">Hình ảnh đính kèm</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 cursor-pointer transition-colors">
                            <Icons.Plus />
                            <span className="text-xs text-slate-400 block mt-1">Click để tải ảnh lên</span>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200">Hủy</button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">Lưu nhật ký</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default DailyLogManager;
