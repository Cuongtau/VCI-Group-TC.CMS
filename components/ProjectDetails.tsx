import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';

interface ProjectDetailsProps {
  projectId: string;
}

interface Role { id: string; name: string; memberCount: number; description?: string; }
interface OrgMember { id: string; name: string; roleId: string; roleTitle: string; email: string; phone: string; avatar: string; }
interface WorkDay { id: string; label: string; hours: number; isActive: boolean; }
interface PermissionModule { 
  id: string; 
  label: string; 
  level: number;
  isExpanded?: boolean;
  parentId?: string | null;
  permissions: { view: boolean; add: boolean; edit: boolean; delete: boolean; }; 
}
interface HistoryEntry { id: string; time: string; date: string; user: string; action: string; type: 'create' | 'edit' | 'status' | 'delete'; }
interface Contract { id: string; code: string; name: string; value: string; date: string; status: 'active' | 'pending' | 'liquidated'; files: number; }
interface Appendix { id: string; code: string; contractId: string; name: string; adjustValue: string; date: string; }

type DataScopeType = 'personal' | 'department' | 'all';

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState('general');
  // Sub-tab state for Permissions
  const [activePermSubTab, setActivePermSubTab] = useState<'functional' | 'users' | 'data'>('functional');
  
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>('r1');
  const [showHistory, setShowHistory] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // --- MOCK DATA STATES ---
  const [history] = useState<HistoryEntry[]>([
    { id: 'h1', time: '09:08 SA', date: '26/07/2025', user: 'Hoàng Anh Lâm', action: 'Chuyển trạng thái Hoạt động', type: 'status' },
    { id: 'h2', time: '09:08 SA', date: '26/07/2025', user: 'Hoàng Anh Lâm', action: 'Thay đổi loại nhiên liệu', type: 'edit' },
  ]);

  const tabs = [
    { id: 'general', label: 'Thông tin' },
    { id: 'org', label: 'Cơ cấu' },
    { id: 'schedule', label: 'Lịch làm' },
    { id: 'permissions', label: 'Phân quyền' },
    { id: 'contract', label: 'Hợp đồng' },
    { id: 'config', label: 'Cấu hình' },
  ];

  const [roles] = useState<Role[]>([
    { id: 'r1', name: 'Giám đốc dự án', memberCount: 1, description: 'Quản trị viên cao nhất của dự án' },
    { id: 'r2', name: 'PGĐ dự án', memberCount: 1, description: 'Hỗ trợ giám đốc điều hành' },
    { id: 'r3', name: 'Kỹ sư trưởng', memberCount: 2, description: 'Chịu trách nhiệm kỹ thuật' },
    { id: 'r4', name: 'Nhân viên kỹ thuật', memberCount: 5, description: 'Thực hiện công việc hiện trường' },
  ]);

  const [members, setMembers] = useState<OrgMember[]>([
    { id: 'm1', name: 'Hoàng Anh Lâm', roleId: 'r1', roleTitle: 'Giám Đốc', email: 'lam.ha@trungchinh.vn', phone: '0988.111.222', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 'm2', name: 'Nguyễn Văn B', roleId: 'r3', roleTitle: 'Kỹ sư', email: 'b.nguyen@trungchinh.vn', phone: '0988.333.444', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 'm3', name: 'Trần Văn C', roleId: 'r3', roleTitle: 'Kỹ sư', email: 'c.tran@trungchinh.vn', phone: '0988.555.666', avatar: 'https://i.pravatar.cc/150?u=3' },
  ]);

  const [workDays, setWorkDays] = useState<WorkDay[]>([
    { id: 't2', label: 'Thứ Hai', hours: 8, isActive: true },
    { id: 't3', label: 'Thứ Ba', hours: 8, isActive: true },
    { id: 't4', label: 'Thứ Tư', hours: 8, isActive: true },
    { id: 't5', label: 'Thứ Năm', hours: 8, isActive: true },
    { id: 't6', label: 'Thứ Sáu', hours: 8, isActive: true },
    { id: 't7', label: 'Thứ Bảy', hours: 4, isActive: true },
    { id: 'cn', label: 'Chủ Nhật', hours: 0, isActive: false },
  ]);

  // Hierarchical Permissions Mock Data
  const [permissionModules, setPermissionModules] = useState<PermissionModule[]>([
    { id: 'pm1', label: 'QUẢN LÝ TIẾN ĐỘ', level: 0, isExpanded: true, permissions: { view: true, add: true, edit: true, delete: false } },
    { id: 'pm1.1', parentId: 'pm1', label: 'Biểu đồ Gantt', level: 1, permissions: { view: true, add: true, edit: true, delete: false } },
    { id: 'pm1.2', parentId: 'pm1', label: 'Cập nhật tiến độ', level: 1, permissions: { view: true, add: true, edit: true, delete: false } },
    
    { id: 'pm2', label: 'NHẬT KÝ THI CÔNG', level: 0, isExpanded: true, permissions: { view: true, add: true, edit: true, delete: true } },
    { id: 'pm2.1', parentId: 'pm2', label: 'Ghi nhật ký', level: 1, permissions: { view: true, add: true, edit: true, delete: false } },
    { id: 'pm2.2', parentId: 'pm2', label: 'Duyệt nhật ký', level: 1, permissions: { view: true, add: false, edit: true, delete: false } },

    { id: 'pm3', label: 'QUẢN LÝ VẬT TƯ', level: 0, isExpanded: false, permissions: { view: true, add: false, edit: false, delete: false } },
    { id: 'pm3.1', parentId: 'pm3', label: 'Nhập kho', level: 1, permissions: { view: true, add: false, edit: false, delete: false } },
    { id: 'pm3.2', parentId: 'pm3', label: 'Xuất kho', level: 1, permissions: { view: true, add: false, edit: false, delete: false } },
  ]);

  // Map: RoleID -> { ModuleID -> Scope }
  const [dataScopes, setDataScopes] = useState<Record<string, Record<string, DataScopeType>>>({
    'r1': { 'pm1': 'all', 'pm1.1': 'all', 'pm2': 'all' }, // Admin defaults
    'r3': { 'pm1': 'department', 'pm2': 'department' },
    'r4': { 'pm1': 'personal', 'pm2': 'personal' }
  });

  const [contracts] = useState<Contract[]>([
    { id: 'c1', code: 'HĐ-2024/001', name: 'Hợp đồng thi công xây dựng chính', value: '15,000,000,000 VNĐ', date: '15/01/2024', status: 'active', files: 3 },
    { id: 'c2', code: 'HĐ-2024/005', name: 'Hợp đồng cung cấp vật tư bê tông', value: '2,400,000,000 VNĐ', date: '20/02/2024', status: 'active', files: 1 },
  ]);

  const [appendixes] = useState<Appendix[]>([
    { id: 'a1', code: 'PL-01/HĐ-2024/001', contractId: 'c1', name: 'Điều chỉnh đơn giá nhân công', adjustValue: '+ 500,000,000 VNĐ', date: '10/06/2024' }
  ]);

  // --- HANDLERS ---
  const handleSaveChanges = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleWorkDay = (id: string) => {
    setWorkDays(prev => prev.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));
  };

  const changeWorkHours = (id: string, hours: number) => {
    setWorkDays(prev => prev.map(d => d.id === id ? { ...d, hours } : d));
  };

  const togglePermission = (moduleId: string, type: keyof PermissionModule['permissions']) => {
    setPermissionModules(prev => {
      const newModules = prev.map(m => 
        m.id === moduleId ? { ...m, permissions: { ...m.permissions, [type]: !m.permissions[type] } } : m
      );
      return newModules;
    });
  };

  const toggleExpandModule = (moduleId: string) => {
    setPermissionModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m
    ));
  };

  const handleUpdateDataScope = (moduleId: string, scope: DataScopeType) => {
    if (!selectedRoleId) return;
    
    setDataScopes(prev => {
      const roleScopes = prev[selectedRoleId] || {};
      
      // Optional: Auto-cascade logic (if parent changes, children change?)
      // For now, let's keep it manual or simple
      const newRoleScopes = { ...roleScopes, [moduleId]: scope };
      
      return { ...prev, [selectedRoleId]: newRoleScopes };
    });
  };

  const getScopeForModule = (moduleId: string): DataScopeType => {
    if (!selectedRoleId) return 'personal';
    return dataScopes[selectedRoleId]?.[moduleId] || 'personal';
  };

  const handleAddUserToRole = () => {
    // Mock adding a user
    const newUser: OrgMember = { 
      id: `m${Date.now()}`, 
      name: 'Nhân sự Mới', 
      roleId: selectedRoleId || '', 
      roleTitle: 'Nhân viên', 
      email: 'new.user@trungchinh.vn', 
      phone: '09xx.xxx.xxx', 
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}` 
    };
    setMembers([...members, newUser]);
    handleSaveChanges();
  };

  // --- RENDERERS ---

  const renderGeneralTab = () => (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm animate-in fade-in">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex flex-col gap-3 items-center mx-auto lg:mx-0 w-full max-w-[200px]">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-widest">Ảnh dự án</label>
          <div className="w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-blue-500 hover:bg-blue-50 transition-all">
             <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-blue-500"><Icons.Plus /></div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-10 md:gap-y-6">
          {[
            { label: 'Mã dự án', val: 'DA.2025.001' },
            { label: 'Tên dự án', val: 'Dự án cầu Máy Chai' },
            { label: 'Hình thức', val: 'Hỗn hợp' },
            { label: 'Giai đoạn', val: 'Khởi công' },
            { label: 'Ngày bắt đầu', val: '28 / 08 / 2025' },
            { label: 'Ngày kết thúc', val: '28 / 08 / 2026' },
          ].map((field, i) => (
            <div key={i} className="space-y-1.5">
              <label className="text-[10px] md:text-xs font-bold text-slate-800 uppercase tracking-widest">{field.label}</label>
              <input type="text" readOnly defaultValue={field.val} className="w-full px-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-medium text-slate-600 outline-none" />
            </div>
          ))}
          <div className="col-span-1 md:col-span-2 space-y-1.5">
            <label className="text-[10px] md:text-xs font-bold text-slate-800 uppercase tracking-widest">Mô tả</label>
            <textarea readOnly defaultValue="Nội dung mô tả dự án chi tiết..." className="w-full px-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-medium text-slate-600 outline-none resize-none h-24" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrgTab = () => (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in h-full">
      {/* Roles List */}
      <div className="w-full lg:flex-[2] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-fit">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Chức danh</h3>
          <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"><Icons.Plus /></button>
        </div>
        <div className="divide-y divide-slate-100 max-h-[300px] lg:max-h-none overflow-y-auto">
          {roles.map((role) => (
            <div 
              key={role.id} 
              onClick={() => setSelectedRoleId(role.id)}
              className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors border-l-4 ${selectedRoleId === role.id ? 'border-blue-600 bg-blue-50/50' : 'border-transparent'}`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-sm font-bold ${selectedRoleId === role.id ? 'text-blue-700' : 'text-slate-700'}`}>{role.name}</span>
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">{role.memberCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Members List */}
      <div className="w-full lg:flex-[3] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full min-h-[400px]">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nhân sự</span>
            <h3 className="text-sm font-black text-blue-700">{roles.find(r => r.id === selectedRoleId)?.name}</h3>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center gap-2">
            <Icons.Plus /> Thêm NV
          </button>
        </div>
        <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
          {members.filter(m => m.roleId === selectedRoleId).length > 0 ? (
            members.filter(m => m.roleId === selectedRoleId).map(member => (
              <div key={member.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group">
                <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full border border-slate-100" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-800">{member.name}</h4>
                  <p className="text-xs text-slate-500 truncate">{member.email} • {member.phone}</p>
                </div>
                <button className="text-slate-300 hover:text-rose-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"><Icons.Delete /></button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-300">
               <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2"><Icons.Search /></div>
               <p className="text-xs font-bold uppercase">Chưa có nhân sự</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderScheduleTab = () => (
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

  // --- PERMISSIONS SUB-COMPONENTS ---
  
  const renderPermFunctional = () => {
    // Filter visible modules based on expansion
    const visibleModules = permissionModules.filter(m => {
      if (m.level === 0) return true;
      const parent = permissionModules.find(p => p.id === m.parentId);
      return parent && parent.isExpanded;
    });

    return (
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-1/3">Phân hệ chức năng</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Xem</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Thêm</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Sửa</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Xóa</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {visibleModules.map(module => (
                  <tr key={module.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center" style={{ paddingLeft: `${module.level * 24}px` }}>
                          {/* Expander for Level 0 */}
                          {module.level === 0 && (
                            <button 
                              onClick={() => toggleExpandModule(module.id)}
                              className="mr-2 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              {module.isExpanded ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
                            </button>
                          )}
                          <span className={`text-sm ${module.level === 0 ? 'font-black text-slate-800' : 'font-medium text-slate-600'}`}>
                            {module.label}
                          </span>
                        </div>
                      </td>
                      {(['view', 'add', 'edit', 'delete'] as const).map(type => (
                        <td key={type} className="p-4 text-center">
                          <label className="inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={module.permissions[type]} 
                                onChange={() => togglePermission(module.id, type)}
                                className="w-5 h-5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 transition-all cursor-pointer"
                              />
                          </label>
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPermUsers = () => {
    const roleMembers = members.filter(m => m.roleId === selectedRoleId);
    
    return (
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 flex flex-col min-h-[400px]">
         <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white sticky top-0 z-10">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Danh sách người dùng</h4>
              <p className="text-xs text-slate-500">Các tài khoản thuộc chức danh này</p>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
               <input 
                 type="text" 
                 placeholder="Tìm kiếm..." 
                 className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 flex-1"
               />
               <button 
                 onClick={handleAddUserToRole}
                 className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap hover:bg-blue-700 transition-colors"
               >
                 + Thêm User
               </button>
            </div>
         </div>
         <div className="flex-1 overflow-y-auto p-0">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <tr>
                     <th className="px-6 py-3">Họ và tên</th>
                     <th className="px-6 py-3 hidden sm:table-cell">Email</th>
                     <th className="px-6 py-3">Chức vụ</th>
                     <th className="px-6 py-3 text-right">Thao tác</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {roleMembers.length > 0 ? roleMembers.map(member => (
                     <tr key={member.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-3">
                           <div className="flex items-center gap-3">
                              <img src={member.avatar} className="w-8 h-8 rounded-full border border-slate-200" alt="User" />
                              <span className="text-sm font-bold text-slate-700">{member.name}</span>
                           </div>
                        </td>
                        <td className="px-6 py-3 hidden sm:table-cell">
                           <span className="text-xs text-slate-500 font-medium">{member.email}</span>
                        </td>
                        <td className="px-6 py-3">
                           <span className="inline-flex px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tracking-wider">
                              {member.roleTitle}
                           </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                           <button className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded transition-all opacity-0 group-hover:opacity-100">
                              <Icons.Delete />
                           </button>
                        </td>
                     </tr>
                  )) : (
                     <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400">
                           <div className="flex flex-col items-center gap-2">
                              <Icons.Search />
                              <span className="text-xs font-bold uppercase">Chưa có nhân sự trong nhóm này</span>
                           </div>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    );
  };

  const renderPermData = () => {
    // Filter visible modules based on expansion (reusing logic from Functional Perms)
    const visibleModules = permissionModules.filter(m => {
      if (m.level === 0) return true;
      const parent = permissionModules.find(p => p.id === m.parentId);
      return parent && parent.isExpanded;
    });

    const scopes: { id: DataScopeType; label: string; icon: React.ReactElement }[] = [
      { id: 'personal', label: 'Cá nhân', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> },
      { id: 'department', label: 'Phòng ban', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> },
      { id: 'all', label: 'Tất cả', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg> },
    ];

    return (
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 flex flex-col min-h-[400px]">
         <div className="p-6 border-b border-slate-100">
             <h4 className="text-sm font-bold text-slate-800">Phạm vi truy cập dữ liệu</h4>
             <p className="text-xs text-slate-500 mt-1">Thiết lập phạm vi dữ liệu được phép xem/thao tác cho từng chức năng.</p>
         </div>
         <div className="overflow-x-auto flex-1">
            <table className="w-full text-left min-w-[700px]">
               <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                  <tr>
                     <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-1/3">Phân hệ chức năng</th>
                     {scopes.map(scope => (
                       <th key={scope.id} className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                         <div className="flex flex-col items-center gap-1">
                           {scope.icon}
                           {scope.label}
                         </div>
                       </th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {visibleModules.map(module => (
                     <tr key={module.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                           <div className="flex items-center" style={{ paddingLeft: `${module.level * 24}px` }}>
                              {module.level === 0 && (
                                 <button 
                                    onClick={() => toggleExpandModule(module.id)}
                                    className="mr-2 text-slate-400 hover:text-blue-600 transition-colors"
                                 >
                                    {module.isExpanded ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
                                 </button>
                              )}
                              <span className={`text-sm ${module.level === 0 ? 'font-black text-slate-800' : 'font-medium text-slate-600'}`}>
                                 {module.label}
                              </span>
                           </div>
                        </td>
                        {scopes.map(scope => {
                           const isSelected = getScopeForModule(module.id) === scope.id;
                           return (
                              <td key={scope.id} className="p-4 text-center">
                                 <div 
                                    onClick={() => handleUpdateDataScope(module.id, scope.id)}
                                    className={`w-5 h-5 mx-auto rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${isSelected ? 'border-blue-600' : 'border-slate-300 hover:border-blue-400'}`}
                                 >
                                    {isSelected && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                                 </div>
                              </td>
                           );
                        })}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="p-4 bg-amber-50 border-t border-amber-100 flex gap-3">
             <div className="text-amber-500 mt-0.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
             <div className="text-xs text-amber-700 leading-relaxed space-y-1">
               <p><strong>Cá nhân:</strong> Chỉ thấy dữ liệu do chính mình tạo ra.</p>
               <p><strong>Phòng ban:</strong> Thấy dữ liệu của các thành viên trong cùng bộ phận.</p>
               <p><strong>Tất cả:</strong> Toàn quyền truy cập dữ liệu của dự án này.</p>
             </div>
         </div>
      </div>
    );
  };

  const renderPermissionsTab = () => (
    <div className="flex flex-col gap-6 animate-in fade-in h-full">
       {/* Role Selector Header */}
       <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="w-full md:w-auto flex-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Đang phân quyền cho chức danh</label>
            <div className="relative max-w-md">
               <select 
                  value={selectedRoleId || ''} 
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className="w-full p-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
               >
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
               </select>
               <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-slate-500"><Icons.ChevronDown /></div>
            </div>
            <p className="text-xs text-slate-500 mt-2 truncate">{roles.find(r => r.id === selectedRoleId)?.description}</p>
          </div>
          
          {/* Sub-Tabs Navigation */}
          <div className="w-full md:w-auto bg-slate-100 p-1.5 rounded-xl flex">
             {[
               { id: 'functional', label: 'Quyền chức năng' },
               { id: 'users', label: 'Người dùng' },
               { id: 'data', label: 'Quyền dữ liệu' }
             ].map(sub => (
               <button
                 key={sub.id}
                 onClick={() => setActivePermSubTab(sub.id as any)}
                 className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${activePermSubTab === sub.id ? 'bg-white text-blue-700 shadow' : 'text-slate-500 hover:text-slate-700 shadow-none'}`}
               >
                 {sub.label}
               </button>
             ))}
          </div>
       </div>

       {/* Sub-Tab Content */}
       <div className="flex-1 min-h-0">
          {activePermSubTab === 'functional' && renderPermFunctional()}
          {activePermSubTab === 'users' && renderPermUsers()}
          {activePermSubTab === 'data' && renderPermData()}
       </div>
    </div>
  );

  const renderConfigTab = () => (
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

  const renderContractTab = () => (
    <div className="space-y-4 animate-in fade-in">
       <div className="flex justify-between items-center"><h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Danh sách Hợp đồng</h3><button className="text-blue-600 text-xs font-bold uppercase hover:underline">+ Thêm mới</button></div>
       {contracts.map(c => (
           <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
               <div className="flex justify-between items-start">
                   <div>
                       <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[10px] font-black">{c.code}</span>
                       <h4 className="text-sm font-bold text-slate-800 mt-2">{c.name}</h4>
                   </div>
                   <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase">{c.status}</span>
               </div>
               <div className="grid grid-cols-2 gap-4 mt-2">
                   <div><p className="text-[10px] text-slate-400 font-bold uppercase">Giá trị</p><p className="text-sm font-bold text-slate-700">{c.value}</p></div>
                   <div><p className="text-[10px] text-slate-400 font-bold uppercase">Ngày ký</p><p className="text-sm font-bold text-slate-700">{c.date}</p></div>
               </div>
               <div className="pt-3 border-t border-slate-100 flex gap-2">
                   <button className="text-xs text-slate-500 font-medium flex items-center gap-1"><Icons.Project /> {c.files} Đính kèm</button>
               </div>
           </div>
       ))}
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4"><h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Phụ lục Hợp đồng</h3><button className="text-blue-600 text-xs font-bold uppercase hover:underline">+ Thêm mới</button></div>
            {appendixes.map(a => (
                <div key={a.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-4">
                    <div className="flex flex-col gap-1 mb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Thuộc: {contracts.find(c => c.id === a.contractId)?.code}</span>
                        <h4 className="text-sm font-bold text-slate-800">{a.name}</h4>
                        <span className="text-xs text-slate-500 font-mono bg-slate-50 w-fit px-2 py-0.5 rounded">{a.code}</span>
                    </div>
                    <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-slate-600">Điều chỉnh:</span>
                        <span className="text-sm font-black text-blue-600">{a.adjustValue}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <div className="flex h-full bg-slate-50/30 overflow-hidden relative">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl animate-in slide-in-from-top text-xs font-bold">
          Cập nhật thành công!
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        {/* Mobile Header Toolbar */}
        <div className="px-4 md:px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="min-w-0">
            <h2 className="text-base md:text-xl font-black text-slate-800 truncate tracking-tight">DA.2025.001</h2>
            <p className="text-[9px] md:text-xs text-slate-400 font-bold uppercase truncate">Cầu Máy Chai - Hải Phòng</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowHistory(!showHistory)} className={`p-2.5 rounded-xl border transition-all ${showHistory ? 'bg-blue-50 border-blue-200 text-blue-600' : 'text-slate-400 border-slate-200'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </button>
            <button onClick={handleSaveChanges} className="px-5 md:px-8 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100">Lưu</button>
          </div>
        </div>

        {/* Tab Selection - Scrollable on mobile */}
        <div className="px-4 md:px-8 border-b border-slate-100 flex gap-6 md:gap-10 bg-white overflow-x-auto no-scrollbar shrink-0">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`}>
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>}
            </button>
          ))}
        </div>

        {/* Main Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {activeTab === 'general' && renderGeneralTab()}
          {activeTab === 'org' && renderOrgTab()}
          {activeTab === 'schedule' && renderScheduleTab()}
          {activeTab === 'permissions' && renderPermissionsTab()}
          {activeTab === 'config' && renderConfigTab()}
          {activeTab === 'contract' && renderContractTab()}
        </div>
      </div>

      {/* Responsive History Panel */}
      {showHistory && (
        <div className="absolute md:relative inset-0 md:inset-auto md:w-[350px] bg-white border-l border-slate-200 z-[60] flex flex-col shadow-2xl md:shadow-none animate-in slide-in-from-right">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Lịch sử thay đổi</h3>
            <button onClick={() => setShowHistory(false)} className="p-2 text-slate-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
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
      )}
    </div>
  );
};

export default ProjectDetails;