
import React, { useState } from 'react';
import { DailyLog } from '../types';
import { Icons } from '../constants';

interface DailyLogManagerProps {
  selectedProjectId: string | null;
}

const DailyLogManager: React.FC<DailyLogManagerProps> = ({ selectedProjectId }) => {
  const [logs] = useState<DailyLog[]>([
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

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Nhật ký tiến độ thi công</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-blue-700 transition-colors shadow-sm">
          <Icons.Plus />
          Tạo nhật ký mới
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex overflow-hidden">
        {/* Date Selector Sidebar */}
        <div className="w-64 border-r border-slate-100 p-4 bg-slate-50/50 flex flex-col">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Lịch trình thi công</h3>
          <div className="space-y-1 flex-1 overflow-y-auto">
            {['2024-05-15', '2024-05-14', '2024-05-13', '2024-05-12', '2024-05-11', '2024-05-10'].map(date => (
              <button key={date} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${date === '2024-05-15' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-white text-slate-600'}`}>
                {date}
              </button>
            ))}
          </div>
        </div>

        {/* Log Details Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-8">
            {logs.map(log => (
              <div key={log.id} className="relative pl-8 pb-8 border-l-2 border-slate-100 last:border-0">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white"></div>
                
                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Hạng mục ID: {log.taskId}</span>
                    <span className="text-xs text-slate-400">{log.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2">Báo cáo tình hình thi công</h4>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{log.content}</p>
                  
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {[1, 2, 3].map(i => (
                      <img key={i} src={`https://picsum.photos/200/120?sig=${log.id+i}`} className="w-32 h-20 rounded-lg object-cover border border-slate-100" alt="Jobsite" />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Tiến độ thực tế</p>
                      <p className="text-sm font-bold text-emerald-600">{log.actualProgress}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Ghi chú quan trọng</p>
                      <p className="text-sm text-slate-600 truncate italic">"{log.notes}"</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyLogManager;
