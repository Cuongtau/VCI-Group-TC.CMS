
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Icons } from '../constants';
import { Notification } from '../types';

interface HeaderProps {
  onLogout: () => void;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();

  const [notifications] = useState<Notification[]>([
    { id: '1', title: 'Cập nhật tiến độ', message: 'Hạng mục Cọc khoan nhồi đã hoàn thành 100%', time: '5 phút trước', isRead: false, type: 'success' },
    { id: '2', title: 'Cảnh báo chậm trễ', message: 'Hạng mục Kết cấu thân P1 đang trễ 2 ngày so với kế hoạch.', time: '1 giờ trước', isRead: false, type: 'warning' },
    { id: '3', title: 'Phê duyệt vật tư', message: 'Yêu cầu nhập kho Thép D20 đã được phê duyệt.', time: '2 giờ trước', isRead: false, type: 'info' },
    { id: '4', title: 'Hệ thống', message: 'Sao lưu dữ liệu dự án P001 thành công.', time: '3 giờ trước', isRead: true, type: 'info' },
    { id: '5', title: 'Nhắc nhở họp', message: 'Cuộc họp giao ban tuần bắt đầu lúc 14:00 chiều nay.', time: '5 giờ trước', isRead: true, type: 'warning' },
    { id: '6', title: 'Báo cáo an toàn', message: 'Đã có báo cáo an toàn lao động tuần 34.', time: '1 ngày trước', isRead: true, type: 'info' },
    { id: '7', title: 'Nghiệm thu', message: 'Hạng mục Móng M1 đã được TVGS ký nghiệm thu.', time: '1 ngày trước', isRead: true, type: 'success' },
    { id: '8', title: 'Cập nhật thiết kế', message: 'Bản vẽ thi công Dầm D1 có thay đổi chi tiết.', time: '2 ngày trước', isRead: true, type: 'warning' },
    { id: '9', title: 'Hệ thống', message: 'Bảo trì hệ thống định kỳ hoàn tất.', time: '3 ngày trước', isRead: true, type: 'info' },
    { id: '10', title: 'Nhân sự', message: 'Đã thêm 5 công nhân mới vào đội thi công 2.', time: '4 ngày trước', isRead: true, type: 'info' },
    { id: '11', title: 'Cảnh báo thời tiết', message: 'Dự báo mưa bão trong 3 ngày tới, cần che chắn vật tư.', time: '5 ngày trước', isRead: true, type: 'warning' },
    { id: '12', title: 'Thanh toán', message: 'Đã nhận được thanh toán đợt 2 từ Chủ đầu tư.', time: '1 tuần trước', isRead: true, type: 'success' },
  ]);

  const getTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Tổng quan';
    if (path === '/projects') return 'Danh sách dự án';
    if (path.match(/^\/projects\/[^/]+$/)) return 'Thông tin dự án';
    if (path.match(/^\/projects\/[^/]+\/schedule$/)) return 'Tiến độ thi công';
    if (path.startsWith('/logs/')) return 'Nhật ký thi công';
    return 'Quản lý';
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 relative z-40">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <h1 className="text-lg md:text-xl font-semibold text-slate-800 truncate max-w-[150px] md:max-w-none">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative group hidden md:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icons.Search />
          </span>
          <input 
            type="text" 
            placeholder="Tìm kiếm nhanh..."
            className="pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 w-48 transition-all focus:w-64 outline-none"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className={`relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors ${showNotifications ? 'bg-slate-100' : ''}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              {/* Overlay for mobile to close when clicking outside */}
              <div className="fixed inset-0 z-[45] md:hidden" onClick={() => setShowNotifications(false)}></div>
              
              <div className="fixed inset-x-4 top-[70px] md:absolute md:inset-auto md:top-full md:right-0 md:mt-2 w-auto md:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-[50] animate-in fade-in slide-in-from-top-2 origin-top-right">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <span className="font-bold text-slate-800">Thông báo ({unreadCount})</span>
                  <button className="text-xs text-blue-600 hover:underline font-semibold">Đã đọc tất cả</button>
                </div>
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar overscroll-contain">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors relative group ${!n.isRead ? 'bg-blue-50/40' : ''}`}>
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {n.type === 'success' && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                            {n.type === 'warning' && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                            {n.type === 'info' && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                            <h4 className={`text-sm font-semibold ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>{n.title}</h4>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-2 block font-medium">{n.time}</span>
                        </div>
                        {!n.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 shrink-0"></div>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                  <button className="text-xs font-bold text-slate-500 hover:text-blue-600">Xem tất cả thông báo</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <div 
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            className="flex items-center gap-2 md:gap-3 md:border-l border-slate-200 md:pl-4 cursor-pointer group"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">Hoàng Anh Lâm</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Giám Đốc Dự Án</p>
            </div>
            <img src="https://picsum.photos/40/40" alt="Avatar" className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-slate-100 shadow-sm group-hover:border-blue-200 transition-colors" />
          </div>

          {showProfileMenu && (
            <>
               <div className="fixed inset-0 z-[45] md:hidden" onClick={() => setShowProfileMenu(false)}></div>
               <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-[50] p-2 animate-in fade-in slide-in-from-top-2 origin-top-right">
                <div className="md:hidden px-4 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-800">Hoàng Anh Lâm</p>
                  <p className="text-[10px] text-slate-400">Giám đốc dự án</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors flex items-center gap-2">
                  <Icons.Settings /> Hồ sơ cá nhân
                </button>
                <div className="my-1 border-t border-slate-100"></div>
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  Đăng xuất
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
