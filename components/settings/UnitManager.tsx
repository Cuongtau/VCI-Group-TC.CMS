
import React, { useState } from 'react';
import { Icons } from '../../constants';
import { Unit } from '../../types';
import ConfirmModal from '../common/ConfirmModal';

const UnitManager: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([
    { id: 'u1', name: 'Tấn', description: 'Dùng cho xi măng, thép...', isSystem: true },
    { id: 'u2', name: 'Kg', description: 'Đơn vị khối lượng nhỏ', isSystem: true },
    { id: 'u3', name: 'm3', description: 'Thể tích (cát, đá, bê tông)', isSystem: true },
    { id: 'u4', name: 'Viên', description: 'Đếm số lượng (gạch)', isSystem: true },
    { id: 'u5', name: 'Thùng 18L', description: 'Dùng cho sơn nước', isSystem: false },
    { id: 'u6', name: 'Cái', description: '', isSystem: false },
    { id: 'u7', name: 'Bộ', description: '', isSystem: false },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null; name: string }>({
    isOpen: false,
    id: null,
    name: ''
  });

  const handleAdd = () => {
      if(!newName.trim()) return;
      const newUnit: Unit = {
          id: `u${Date.now()}`,
          name: newName,
          description: newDesc,
          isSystem: false
      };
      setUnits([...units, newUnit]);
      setNewName('');
      setNewDesc('');
      setIsAdding(false);
  };

  const openDeleteModal = (u: Unit) => {
    setDeleteModal({ isOpen: true, id: u.id, name: u.name });
  };

  const confirmDelete = () => {
      if (deleteModal.id) {
        setUnits(prev => prev.filter(u => u.id !== deleteModal.id));
      }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto h-full flex flex-col">
       <div className="flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Đơn vị tính</h2>
            <p className="text-sm text-slate-500">Quản lý các đơn vị đo lường trong hệ thống.</p>
          </div>
          <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
            + Thêm đơn vị
          </button>
       </div>

       {isAdding && (
           <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-lg animate-in fade-in slide-in-from-top-2">
               <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase">Thêm mới</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                   <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Tên đơn vị *</label>
                       <input autoFocus type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" placeholder="VD: Mét dài" />
                   </div>
                   <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Mô tả</label>
                       <input type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Mô tả thêm..." />
                   </div>
               </div>
               <div className="flex justify-end gap-2">
                   <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Hủy</button>
                   <button onClick={handleAdd} className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Lưu</button>
               </div>
           </div>
       )}

       <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
             <table className="w-full text-left">
                 <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest sticky top-0">
                     <tr>
                         <th className="px-6 py-4">Tên đơn vị</th>
                         <th className="px-6 py-4">Mô tả</th>
                         <th className="px-6 py-4 text-center">Loại</th>
                         <th className="px-6 py-4 text-right">Thao tác</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                     {units.map(u => (
                         <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                             <td className="px-6 py-4 font-bold text-slate-700">{u.name}</td>
                             <td className="px-6 py-4 text-sm text-slate-500">{u.description}</td>
                             <td className="px-6 py-4 text-center">
                                 {u.isSystem ? <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded">Hệ thống</span> : <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded">Tùy chỉnh</span>}
                             </td>
                             <td className="px-6 py-4 text-right">
                                 {!u.isSystem && (
                                     <button onClick={() => openDeleteModal(u)} className="text-slate-300 hover:text-rose-500 p-2"><Icons.Delete /></button>
                                 )}
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
          </div>
       </div>

       {/* Confirm Delete Modal */}
       <ConfirmModal 
         isOpen={deleteModal.isOpen}
         onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
         onConfirm={confirmDelete}
         message={
            <span>Bạn có muốn xóa đơn vị <b>[{deleteModal.name}]</b> không?</span>
         }
       />
    </div>
  );
};

export default UnitManager;
