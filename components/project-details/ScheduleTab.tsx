
import React, { useState } from 'react';
import { WorkDay } from '../../types';

interface ScheduleTabProps {
  // Pass necessary props here
}

const ScheduleTab: React.FC<ScheduleTabProps> = () => {
  const [workDays, setWorkDays] = useState<WorkDay[]>([
    { id: 't2', label: 'Thứ Hai', hours: 8, isActive: true },
    { id: 't3', label: 'Thứ Ba', hours: 8, isActive: true },
    { id: 't4', label: 'Thứ Tư', hours: 8, isActive: true },
    { id: 't5', label: 'Thứ Năm', hours: 8, isActive: true },
    { id: 't6', label: 'Thứ Sáu', hours: 8, isActive: true },
    { id: 't7', label: 'Thứ Bảy', hours: 4, isActive: true },
    { id: 'cn', label: 'Chủ Nhật', hours: 0, isActive: false },
  ]);

  const toggleWorkDay = (id: string) => {
    setWorkDays(prev => prev.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));
  };

  const changeWorkHours = (id: string, hours: number) => {
    setWorkDays(prev => prev.map(d => d.id === id ? { ...d, hours } : d));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm animate-in fade-in">
       <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Thiết lập thời gian làm việc</h3>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {workDays.map(day => (
            <div key={day.id} className={`p-4 rounded-2xl border transition-all duration-300 ${day.isActive ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100 bg-slate-50 opacity-70'}`}>
               <div className="flex justify-between items-center mb-4">
                  <span className={`text-sm font-bold ${day.isActive ? 'text-blue-700' : 'text-slate-500'}`}>{day.label}</span>
                  <button 
                    onClick={() => toggleWorkDay(day.id)}
                    className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${day.isActive ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${day.isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </button>
               </div>
               <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    disabled={!day.isActive}
                    value={day.hours} 
                    onChange={(e) => changeWorkHours(day.id, parseFloat(e.target.value))}
                    className={`w-full py-2 px-3 rounded-xl text-center font-bold text-sm outline-none transition-colors ${day.isActive ? 'bg-white text-slate-800 ring-2 ring-transparent focus:ring-blue-200' : 'bg-slate-200 text-slate-400'}`}
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Giờ</span>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

export default ScheduleTab;
