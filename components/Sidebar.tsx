
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icons } from '../constants';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    catalog: true,
    resources: true,
    config: true,
  });

  const location = useLocation();
  
  const toggleMenu = (key: string) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Logic kiểm tra Active Menu
  const checkActive = (itemLink: string) => {
    const currentPath = location.pathname;

    // Dashboard
    if (itemLink === '/dashboard') return currentPath === '/dashboard';

    // Exact Match for settings to prevent overlaps if necessary
    if (itemLink.startsWith('/settings')) return currentPath === itemLink;

    // Các mục khác match startWith
    return currentPath.startsWith(itemLink);
  };

  const sections = [
    {
      id: 'catalog',
      label: 'QUẢN LÝ DỰ ÁN',
      items: [
        { id: 'projects', label: 'Danh sách dự án', icon: Icons.Dashboard, link: '/projects', activeBase: '/projects' },
      ]
    },
    {
      id: 'resources',
      label: 'QUẢN LÝ NGUỒN LỰC',
      items: [
        { id: 'materials', label: 'Kho Vật tư', icon: Icons.Cube, link: '/resources/materials', activeBase: '/resources/materials' },
        { id: 'equipment', label: 'Máy & Thiết bị', icon: Icons.Truck, link: '/resources/equipment', activeBase: '/resources/equipment' },
      ]
    },
    {
      id: 'config',
      label: 'DANH MỤC & CẤU HÌNH',
      items: [
        { id: 'units', label: 'Đơn vị tính', icon: Icons.Tag, link: '/settings/units', activeBase: '/settings/units' },
        { id: 'categories', label: 'Phân loại vật tư', icon: Icons.Category, link: '/settings/categories', activeBase: '/settings/categories' },
      ]
    }
  ];

  return (
    <aside className={`h-full bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${isCollapsed ? 'w-20' : 'w-72 lg:w-64'}`}>
      {/* Header Sidebar - Workspace Switcher Style */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-2">
        <div className={`flex items-center gap-3 overflow-hidden ${!isCollapsed ? 'flex-1 cursor-pointer p-2 -ml-2 rounded-xl hover:bg-slate-50 transition-colors group' : 'justify-center'}`}>
           <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0">
             {/* Abstract Building Logo */}
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
           </div>
           
           {!isCollapsed && (
             <div className="flex-1 min-w-0 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-800 text-sm truncate leading-tight group-hover:text-blue-700 transition-colors">Trung Chinh Corp</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Enterprise Workspace</p>
                </div>
                <div className="text-slate-300 group-hover:text-blue-600 transition-colors transform group-hover:translate-y-0.5 duration-200">
                  <Icons.ChevronDown />
                </div>
             </div>
           )}
        </div>
        
        {/* Toggle Button */}
        <div className="flex items-center shrink-0">
          <button onClick={onClose} className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:block p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
            {isCollapsed ? <Icons.ChevronRight /> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>}
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        <Link
          to="/dashboard"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold ${
            checkActive('/dashboard') ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Icons.Dashboard />
          {(!isCollapsed || window.innerWidth < 1024) && <span>Bảng điều khiển</span>}
        </Link>

        {sections.map((section) => (
          <div key={section.id} className="space-y-2">
            {(!isCollapsed || window.innerWidth < 1024) && (
              <div className="flex items-center justify-between px-3 cursor-pointer group" onClick={() => toggleMenu(section.id)}>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{section.label}</p>
                <div className={`transition-transform ${expandedMenus[section.id] ? 'rotate-180' : ''}`}><Icons.ChevronDown /></div>
              </div>
            )}
            {((!isCollapsed || window.innerWidth < 1024) ? expandedMenus[section.id] : true) && (
              <div className="space-y-1 mt-2">
                {section.items.map((item) => {
                  const isActive = checkActive(item.activeBase);
                  return (
                    <Link
                      key={item.id}
                      to={item.link}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <item.icon />
                      {(!isCollapsed || window.innerWidth < 1024) && <span className="flex-1 text-left">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
