
import React, { useState } from 'react';
import { Icons } from '../../constants';
import { Category } from '../../types';
import ConfirmModal from '../common/ConfirmModal';

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 'c1', code: 'VLXD', name: 'Vật liệu xây dựng', type: 'material', description: 'Cát, đá, xi măng...' },
    { id: 'c2', code: 'THEP', name: 'Sắt thép', type: 'material', description: 'Thép hình, thép cuộn, thép tấm' },
    { id: 'c3', code: 'GACH', name: 'Gạch', type: 'material', description: 'Gạch ống, gạch thẻ, gạch block' },
    { id: 'c4', code: 'HT', name: 'Hoàn thiện', type: 'material', description: 'Sơn, bột trét, thạch cao' },
    { id: 'c5', code: 'MAY-DAO', name: 'Máy đào', type: 'equipment', description: 'Các loại máy xúc đào' },
    { id: 'c6', code: 'XE-TAI', name: 'Xe tải', type: 'equipment', description: 'Xe ben, xe tải thùng' },
  ]);

  const [activeTab, setActiveTab] = useState<'material' | 'equipment'>('material');
  const filteredCategories = categories.filter(c => c.type === activeTab);

  // Delete State
  const [deleteData, setDeleteData] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: '',
    name: ''
  });

  const initiateDelete = (c: Category) => {
    setDeleteData({ isOpen: true, id: c.id, name: c.name });
  };

  const handleDelete = () => {
    setCategories(prev => prev.filter(c => c.id !== deleteData.id));
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto h-full flex flex-col">
       <div className="flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Phân loại & Nhóm</h2>
            <p className="text-sm text-slate-500">Quản lý cây danh mục vật tư và thiết bị.</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
            + Thêm nhóm
          </button>
       </div>

       <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex-1 flex flex-col">
           {/* Tab Header */}
           <div className="flex border-b border-slate-100">
               <button 
                  onClick={() => setActiveTab('material')} 
                  className={`px-8 py-4 text-sm font-bold transition-all relative ${activeTab === 'material' ? 'text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                   Nhóm Vật tư
                   {activeTab === 'material' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
               </button>
               <button 
                  onClick={() => setActiveTab('equipment')} 
                  className={`px-8 py-4 text-sm font-bold transition-all relative ${activeTab === 'equipment' ? 'text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                   Nhóm Thiết bị
                   {activeTab === 'equipment' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
               </button>
           </div>

           <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest sticky top-0">
                        <tr>
                            <th className="px-6 py-4">Mã nhóm</th>
                            <th className="px-6 py-4">Tên nhóm</th>
                            <th className="px-6 py-4">Mô tả</th>
                            <th className="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredCategories.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4"><span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{c.code}</span></td>
                                <td className="px-6 py-4 font-bold text-slate-800">{c.name}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{c.description}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                      <button className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50"><Icons.Edit /></button>
                                      <button onClick={() => initiateDelete(c)} className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50"><Icons.Delete /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
           </div>
       </div>

       {/* Confirm Modal */}
       <ConfirmModal 
         isOpen={deleteData.isOpen}
         onClose={() => setDeleteData({ ...deleteData, isOpen: false })}
         onConfirm={handleDelete}
         message={<span>Bạn có muốn xóa nhóm <b>[{deleteData.name}]</b> không?</span>}
       />
    </div>
  );
};

export default CategoryManager;
