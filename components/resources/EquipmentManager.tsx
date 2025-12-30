
import React, { useState } from 'react';
import { Icons } from '../../constants';
import { Equipment } from '../../types';
import ConfirmModal from '../common/ConfirmModal';

const EquipmentManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  
  // Delete Modal State
  const [deleteData, setDeleteData] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: '',
    name: ''
  });
  
  // Form State
  const [formData, setFormData] = useState<Partial<Equipment>>({});

  // Mock data
  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: 'eq1', code: 'MAY-001', name: 'Máy xúc Komatsu PC200', type: 'Máy đào', status: 'in_use', location: 'DA.2025.001 - Cầu Máy Chai', purchaseDate: '2020-01-15', value: 1200000000 },
    { id: 'eq2', code: 'MAY-002', name: 'Cần trục tháp Zoomlion', type: 'Cần trục', status: 'available', location: 'Kho Tổng', purchaseDate: '2022-06-20', value: 3500000000 },
    { id: 'eq3', code: 'XE-001', name: 'Xe tải Howo 4 chân', type: 'Xe vận tải', status: 'maintenance', location: 'Xưởng bảo trì', purchaseDate: '2021-03-10', value: 850000000 },
    { id: 'eq4', code: 'MAY-003', name: 'Máy ủi Caterpillar D6R', type: 'Máy ủi', status: 'broken', location: 'Bãi máy', purchaseDate: '2019-11-05', value: 1500000000 },
  ]);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ 
      code: '', name: '', type: 'Máy thi công', 
      status: 'available', location: '', purchaseDate: '', value: 0 
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Equipment) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.code) return alert('Vui lòng nhập tên và mã thiết bị');

    const finalData: Equipment = {
      ...formData as Equipment,
      id: editingItem ? editingItem.id : `eq_${Date.now()}`,
    };

    if (editingItem) {
      setEquipment(prev => prev.map(e => e.id === finalData.id ? finalData : e));
    } else {
      setEquipment(prev => [...prev, finalData]);
    }
    setIsModalOpen(false);
  };

  const initiateDelete = (e: Equipment) => {
    setDeleteData({ isOpen: true, id: e.id, name: e.name });
  };

  const handleDelete = () => {
      setEquipment(prev => prev.filter(e => e.id !== deleteData.id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
        case 'available': return 'bg-emerald-100 text-emerald-700';
        case 'in_use': return 'bg-blue-100 text-blue-700';
        case 'maintenance': return 'bg-amber-100 text-amber-700';
        case 'broken': return 'bg-rose-100 text-rose-700';
        default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
        case 'available': return 'Sẵn sàng';
        case 'in_use': return 'Đang hoạt động';
        case 'maintenance': return 'Bảo trì';
        case 'broken': return 'Hỏng/Chờ thanh lý';
        default: return 'Không rõ';
    }
  };

  const filteredEquipment = equipment.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center shrink-0">
        <div>
           <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Máy & Thiết bị thi công</h2>
           <p className="text-sm text-slate-500 mt-1">Theo dõi trạng thái, vị trí và lịch sử bảo trì của máy móc.</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
           <Icons.Plus /> Thêm Thiết bị
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
         <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="relative group w-80">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"><Icons.Search /></span>
                <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder="Tìm máy móc..."
                   className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                />
             </div>
         </div>
         
         <div className="flex-1 overflow-x-auto overflow-y-auto">
            <table className="w-full text-left min-w-[1000px]">
                <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest sticky top-0 z-20">
                    <tr>
                        <th className="px-6 py-4">Mã TB</th>
                        <th className="px-6 py-4">Tên thiết bị</th>
                        <th className="px-6 py-4">Loại</th>
                        <th className="px-6 py-4">Vị trí hiện tại</th>
                        <th className="px-6 py-4 text-center">Trạng thái</th>
                        <th className="px-6 py-4 text-right">Giá trị (VNĐ)</th>
                        <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredEquipment.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold">{item.code}</span></td>
                            <td className="px-6 py-4"><span className="text-sm font-bold text-slate-700">{item.name}</span></td>
                            <td className="px-6 py-4 text-xs font-medium text-slate-600">{item.type}</td>
                            <td className="px-6 py-4 text-xs font-medium text-slate-600 truncate max-w-[200px]">{item.location}</td>
                            <td className="px-6 py-4 text-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(item.status)}`}>
                                    {getStatusText(item.status)}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right text-xs font-medium text-slate-600">{new Intl.NumberFormat('vi-VN').format(item.value)}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => handleOpenEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Icons.Edit /></button>
                                    <button onClick={() => initiateDelete(item)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Icons.Delete /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
      </div>

      {/* --- MODAL POPUP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-bold text-slate-800">{editingItem ? 'Cập nhật Thiết bị' : 'Thêm Thiết bị mới'}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              </div>
              <div className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-700 uppercase">Mã TB <span className="text-rose-500">*</span></label>
                       <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-700 uppercase">Loại thiết bị</label>
                       <input type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-700 uppercase">Tên thiết bị <span className="text-rose-500">*</span></label>
                     <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-700 uppercase">Trạng thái</label>
                       <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none">
                          <option value="available">Sẵn sàng</option>
                          <option value="in_use">Đang hoạt động</option>
                          <option value="maintenance">Bảo trì</option>
                          <option value="broken">Hỏng/Thanh lý</option>
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-700 uppercase">Giá trị (VNĐ)</label>
                       <input type="number" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-700 uppercase">Vị trí hiện tại</label>
                     <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                 </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                 <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50">Hủy</button>
                 <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">Lưu thông tin</button>
              </div>
           </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      <ConfirmModal 
        isOpen={deleteData.isOpen}
        onClose={() => setDeleteData({ ...deleteData, isOpen: false })}
        onConfirm={handleDelete}
        message={<span>Bạn có muốn xóa thiết bị <b>[{deleteData.name}]</b> không?</span>}
      />
    </div>
  );
};

export default EquipmentManager;
