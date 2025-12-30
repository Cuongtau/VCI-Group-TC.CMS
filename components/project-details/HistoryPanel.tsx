
import React, { useState } from 'react';
import { HistoryEntry } from '../../types';

interface HistoryPanelProps {
  onClose: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ onClose }) => {
  const [history] = useState<HistoryEntry[]>([
    { id: 'h1', time: '09:08 SA', date: '26/07/2025', user: 'Hoàng Anh Lâm', action: 'Chuyển trạng thái Hoạt động', type: 'status' },
    { id: 'h2', time: '09:08 SA', date: '26/07/2025', user: 'Hoàng Anh Lâm', action: 'Thay đổi loại nhiên liệu', type: 'edit' },
  ]);

  return (
    <div className="absolute md:relative inset-0 md:inset-auto md:w-[350px] bg-white border-l border-slate-200 z-[60] flex flex-col shadow-2xl md:shadow-none animate-in slide-in-from-right">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
        <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Lịch sử thay đổi</h3>
        <button onClick={onClose} className="p-2 text-slate-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {history.map(entry => (
          <div key={entry.id} className="relative pl-6 border-l border-slate-100 pb-2">
            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white"></div>
            <p className="text-[9px] font-bold text-slate-400 mb-1">{entry.date} - {entry.time}</p>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{entry.action} bởi <b className="text-slate-800">{entry.user}</b></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
