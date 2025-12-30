
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

const data = [
  { name: 'MT2-2024', planned: 60, actual: 55 },
  { name: 'TH-01', planned: 90, actual: 88 },
  { name: 'BT-X1', planned: 30, actual: 40 },
  { name: 'HL-S2', planned: 70, actual: 65 },
];

const activityData = [
  { name: 'T2', value: 40 },
  { name: 'T3', value: 30 },
  { name: 'T4', value: 65 },
  { name: 'T5', value: 45 },
  { name: 'T6', value: 90 },
  { name: 'T7', value: 70 },
  { name: 'CN', value: 50 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight text-center md:text-left">Chào buổi sáng, Lâm!</h2>
          <p className="text-slate-500 font-medium text-center md:text-left text-sm md:text-base">Bạn có 4 hạng mục cần phê duyệt nghiệm thu.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-widest text-center">Hệ thống: Ổn định</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { label: 'Dự án đang chạy', value: '48', color: 'bg-blue-600', trend: '+12%', sub: 'So với quý trước' },
          { label: 'Hạng mục hoàn thành', value: '1,248', color: 'bg-emerald-500', trend: '+5%', sub: 'Tăng trưởng tháng' },
          { label: 'Nguồn lực hiện tại', value: '852', color: 'bg-amber-500', trend: '-2%', sub: 'Công nhân/Máy móc' },
          { label: 'Chậm tiến độ', value: '04', color: 'bg-rose-500', trend: '-5%', sub: 'Dự án cần lưu ý' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
               <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.trend}
               </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{stat.value}</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">{stat.sub}</p>
            <div className={`mt-6 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden`}>
              <div className={`h-full rounded-full ${stat.color}`} style={{ width: '65%' }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-800">Tiến độ Tổng lực</h3>
              <p className="text-xs md:text-sm text-slate-400 font-medium">Planned vs Actual</p>
            </div>
            <div className="flex bg-slate-50 p-1 rounded-xl w-fit">
               <button className="px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm">TUẦN</button>
               <button className="px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-bold text-slate-400">THÁNG</button>
            </div>
          </div>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-6 md:p-8 rounded-[32px] md:rounded-[40px] shadow-2xl flex flex-col text-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg md:text-xl font-bold">Hoạt động mới</h3>
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">8+</span>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto max-h-80 md:max-h-none pr-2 custom-scrollbar">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-blue-600 transition-colors">
                  <span className="text-[10px] md:text-xs font-black">TC</span>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-slate-100">
                    Trần Hồng Hà <span className="font-normal text-slate-400">cập nhật tiến độ</span> Hạng mục Móng
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase font-black tracking-widest">2 giờ trước</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-3 md:py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">
            Toàn bộ nhật ký
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
