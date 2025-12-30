
import React from 'react';

const ConfigTab: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in">
        <div className="p-6 border-b border-slate-100"><h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Cấu hình hệ thống</h3></div>
        <div className="p-6 space-y-6">
             <div className="flex items-center justify-between">
                <div><p className="text-sm font-bold text-slate-700">Thông báo qua Email</p><p className="text-xs text-slate-400">Nhận email khi có cập nhật tiến độ mới</p></div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
             </div>
             <div className="flex items-center justify-between">
                <div><p className="text-sm font-bold text-slate-700">Tự động sao lưu</p><p className="text-xs text-slate-400">Sao lưu dữ liệu dự án hàng ngày lúc 00:00</p></div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase">Ngôn ngữ hiển thị</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"><option>Tiếng Việt</option><option>English</option></select>
             </div>
        </div>
    </div>
  );
};

export default ConfigTab;
