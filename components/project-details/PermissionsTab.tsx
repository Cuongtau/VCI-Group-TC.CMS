
import React, { useState } from 'react';
import { Icons } from '../../constants';
import { PermissionModule, DataScopeType, Role, OrgMember } from '../../types';
import ConfirmModal from '../common/ConfirmModal';

// Mock data for roles to be used in dropdown
const mockRoles: Role[] = [
    { id: 'r1', name: 'Giám đốc dự án', memberCount: 1, description: 'Quản trị viên cao nhất của dự án' },
    { id: 'r2', name: 'PGĐ dự án', memberCount: 1, description: 'Hỗ trợ giám đốc điều hành' },
    { id: 'r3', name: 'Kỹ sư trưởng', memberCount: 2, description: 'Chịu trách nhiệm kỹ thuật' },
    { id: 'r4', name: 'Nhân viên kỹ thuật', memberCount: 5, description: 'Thực hiện công việc hiện trường' },
];

const initialMembers: OrgMember[] = [
    { id: 'm1', name: 'Hoàng Anh Lâm', roleId: 'r1', roleTitle: 'Giám Đốc', email: 'lam.ha@trungchinh.vn', phone: '0988.111.222', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 'm2', name: 'Nguyễn Văn B', roleId: 'r3', roleTitle: 'Kỹ sư', email: 'b.nguyen@trungchinh.vn', phone: '0988.333.444', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 'm3', name: 'Trần Văn C', roleId: 'r3', roleTitle: 'Kỹ sư', email: 'c.tran@trungchinh.vn', phone: '0988.555.666', avatar: 'https://i.pravatar.cc/150?u=3' },
];

interface PermissionsTabProps {
  onShowToast: () => void;
}

const PermissionsTab: React.FC<PermissionsTabProps> = ({ onShowToast }) => {
  const [activePermSubTab, setActivePermSubTab] = useState<'functional' | 'users' | 'data'>('functional');
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>('r1');
  const [members, setMembers] = useState<OrgMember[]>(initialMembers);
  
  // State for permissions
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

  const [dataScopes, setDataScopes] = useState<Record<string, Record<string, DataScopeType>>>({
    'r1': { 'pm1': 'all', 'pm1.1': 'all', 'pm2': 'all' },
    'r3': { 'pm1': 'department', 'pm2': 'department' },
    'r4': { 'pm1': 'personal', 'pm2': 'personal' }
  });

  // Delete User Modal State
  const [deleteUserModal, setDeleteUserModal] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: '',
    name: ''
  });

  const togglePermission = (moduleId: string, type: keyof PermissionModule['permissions']) => {
    setPermissionModules(prev => prev.map(m => 
        m.id === moduleId ? { ...m, permissions: { ...m.permissions, [type]: !m.permissions[type] } } : m
    ));
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
      const newRoleScopes = { ...roleScopes, [moduleId]: scope };
      return { ...prev, [selectedRoleId]: newRoleScopes };
    });
  };

  const getScopeForModule = (moduleId: string): DataScopeType => {
    if (!selectedRoleId) return 'personal';
    return dataScopes[selectedRoleId]?.[moduleId] || 'personal';
  };

  const initiateDeleteUser = (m: OrgMember) => {
    setDeleteUserModal({ isOpen: true, id: m.id, name: m.name });
  };

  const confirmDeleteUser = () => {
    setMembers(prev => prev.filter(m => m.id !== deleteUserModal.id));
    onShowToast();
  };

  const renderPermFunctional = () => {
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
                 onClick={onShowToast}
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
                           <button 
                             onClick={() => initiateDeleteUser(member)}
                             className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded transition-all opacity-0 group-hover:opacity-100"
                           >
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

  return (
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
                  {mockRoles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
               </select>
               <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-slate-500"><Icons.ChevronDown /></div>
            </div>
            <p className="text-xs text-slate-500 mt-2 truncate">{mockRoles.find(r => r.id === selectedRoleId)?.description}</p>
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

       {/* Confirm Modal */}
       <ConfirmModal 
         isOpen={deleteUserModal.isOpen}
         onClose={() => setDeleteUserModal({ ...deleteUserModal, isOpen: false })}
         onConfirm={confirmDeleteUser}
         message={<span>Bạn có muốn xóa người dùng <b>[{deleteUserModal.name}]</b> khỏi chức danh này không?</span>}
       />
    </div>
  );
};

export default PermissionsTab;
