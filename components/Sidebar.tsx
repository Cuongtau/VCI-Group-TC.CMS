
import React, { useState } from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';
import { Icons } from '../constants';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    catalog: true,
    operation: true,
  });

  const location = useLocation();
  
  // Xác định Project Context
  const projectMatch = matchPath({ path: "/projects/:projectId/*" }, location.pathname);
  const projectDetailMatch = matchPath({ path: "/projects/:projectId", end: true }, location.pathname);
  const currentProjectId = projectMatch?.params.projectId || projectDetailMatch?.params.projectId;

  const toggleMenu = (key: string) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getContextAwareLink = (type: 'details' | 'logs') => {
    if (currentProjectId) {
      switch (type) {
        case 'details': return `/projects/${currentProjectId}`;
        case 'logs': return `/projects/${currentProjectId}/logs`;
      }
    }
    return '/projects';
  };

  // Logic kiểm tra Active Menu (Updated)
  const checkActive = (itemLink: string) => {
    const currentPath = location.pathname;

    // 1. Dashboard
    if (itemLink === '/dashboard') return currentPath === '/dashboard';

    // 2. Danh sách dự án (Root)
    // Chỉ sáng khi ở đúng trang danh sách, không sáng khi đã vào chi tiết
    if (itemLink === '/projects') return currentPath === '/projects';

    // 3. Thông tin dự án (Menu Cha ngữ cảnh)
    if (currentProjectId) {
      const projectRoot = `/projects/${currentProjectId}`;
      
      // Nếu item là "Thông tin dự án"
      if (itemLink === projectRoot) {
        // Sáng khi đang ở root dự án HOẶC bất kỳ trang con nào của dự án (schedule, logs, settings...)
        // Trừ khi có menu con cụ thể khác được định nghĩa bên dưới (ví dụ Nhật ký có menu riêng thì logic này có thể override tùy ý)
        // Ở đây ta muốn: Vào "Tiến độ" (không có menu) -> Sáng "Thông tin dự án"
        return currentPath.startsWith(projectRoot);
      }

      // Nếu item là "Nhật ký" (Menu con cụ thể)
      if (itemLink === `${projectRoot}/logs`) {
        return currentPath === itemLink;
      }
    }

    // 4. Các cài đặt khác
    if (itemLink !== '/projects' && !itemLink.includes('/projects/')) {
       return currentPath.startsWith(itemLink);
    }

    return false;
  };

  const sections = [
    {
      id: 'catalog',
      label: 'QUẢN LÝ DỰ ÁN',
      items: [
        { id: 'projects', label: 'Danh sách dự án', icon: Icons.Dashboard, link: '/projects' },
        { id: 'project_details', label: 'Thông tin dự án', icon: Icons.Project, link: getContextAwareLink('details') },
      ]
    },
    {
      id: 'operation',
      label: 'THI CÔNG & VẬT TƯ',
      items: [
        // Đã xóa Gantt Chart
        { id: 'logs', label: 'Nhật ký thi công', icon: Icons.Edit, link: getContextAwareLink('logs') },
        { id: 'units', label: 'Đơn vị tính', icon: Icons.Settings, link: '/settings/units' },
        { id: 'material_types', label: 'Phân loại vật tư', icon: Icons.Settings, link: '/settings/materials' },
      ]
    }
  ];

  return (
    <aside className={`h-full bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${isCollapsed ? 'w-20' : 'w-72 lg:w-64'}`}>
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-700 rounded flex items-center justify-center text-white font-black text-xl shadow-inner">
            TC
          </div>
          {!isCollapsed && (
            <span className="font-bold text-slate-800 text-sm leading-tight">
              TRUNG CHINH<br/>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Construction</span>
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
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
                  // Logic hiển thị menu ngữ cảnh
                  const isContextLinkWithoutId = !currentProjectId && (item.id === 'project_details' || item.id === 'logs');
                  if (isContextLinkWithoutId) return null;

                  const isActive = checkActive(item.link);

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

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-900 p-4 rounded-2xl flex items-center gap-3 text-white">
          <img src="https://picsum.photos/40/40?grayscale" alt="Avatar" className="w-10 h-10 rounded-xl border border-white/20" />
          {(!isCollapsed || window.innerWidth < 1024) && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Hoàng Anh Lâm</p>
              <p className="text-[10px] text-slate-400 truncate uppercase">Giám Đốc Dự Án</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
