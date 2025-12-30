
import React, { useState } from 'react';
import { Icons } from '../../constants';
import { Role, OrgMember } from '../../types';

interface OrgTabProps {
  onShowToast: () => void;
}

const OrgTab: React.FC<OrgTabProps> = ({ onShowToast }) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>('r1');
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  const [roles, setRoles] = useState<Role[]>([
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

  const handleAddUserToRole = () => {
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
    onShowToast();
  };

  const handleAddRole = () => {
    if (!newRoleName.trim()) return;
    
    const newRole: Role = {
      id: `r${Date.now()}`,
      name: newRoleName,
      memberCount: 0,
      description: newRoleDesc
    };
    
    setRoles([...roles, newRole]);
    setNewRoleName('');
    setNewRoleDesc('');
    setShowAddRoleModal(false);
    onShowToast();
  };

  const renderAddRoleModal = () => (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <h3 className="text-lg font-bold text-slate-800">Thêm chức danh mới</h3>
             <button onClick={() => setShowAddRoleModal(false)} className="text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
          </div>
          <div className="p-6 space-y-4">
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-widest">Tên chức danh <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Ví dụ: Kỹ sư trắc đạc"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-widest">Mô tả</label>
                <textarea 
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Mô tả trách nhiệm của vị trí này..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                />
             </div>
          </div>
          <div className="p-6 pt-0 flex justify-end gap-3">
             <button 
                onClick={() => setShowAddRoleModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
             >
                Hủy bỏ
             </button>
             <button 
                onClick={handleAddRole}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors"
             >
                Thêm mới
             </button>
          </div>
       </div>
    </div>
  );

  return (
    <>
      {showAddRoleModal && renderAddRoleModal()}
      <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in h-full">
        {/* Roles List */}
        <div className="w-full lg:flex-[2] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-fit">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Chức danh</h3>
            <button 
              onClick={() => setShowAddRoleModal(true)}
              className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
              title="Thêm chức danh"
            >
              <Icons.Plus />
            </button>
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
            <button 
              onClick={handleAddUserToRole}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center gap-2"
            >
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
    </>
  );
};

export default OrgTab;
