
import React, { useState } from 'react';
import { Icons } from '../../constants';
import { Material, Category, Unit } from '../../types';
import ConfirmModal from '../common/ConfirmModal';

const MaterialManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'groups'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // --- MOCK DATA ---
  const [units] = useState<Unit[]>([
    { id: 'u1', name: 'Tấn', isSystem: true },
    { id: 'u2', name: 'Kg', isSystem: true },
    { id: 'u3', name: 'm3', isSystem: true },
    { id: 'u4', name: 'Viên', isSystem: true },
    { id: 'u5', name: 'Thùng 18L', isSystem: false },
    { id: 'u6', name: 'Cái', isSystem: false },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: 'c1', code: 'VLXD', name: 'Vật liệu xây dựng', type: 'material', description: 'Cát, đá, xi măng...' },
    { id: 'c2', code: 'THEP', name: 'Sắt thép', type: 'material', description: 'Thép hình, thép cuộn' },
    { id: 'c3', code: 'GACH', name: 'Gạch', type: 'material', description: 'Gạch ống, gạch thẻ' },
    { id: 'c4', code: 'HT', name: 'Hoàn thiện', type: 'material', description: 'Sơn, bột trét' },
  ]);

  const [materials, setMaterials] = useState<Material[]>([
    { id: 'm1', code: 'VT-001', name: 'Xi măng PCB40', categoryId: 'c1', categoryName: 'Vật liệu xây dựng', unitId: 'u1', unitName: 'Tấn', inStock: 1500, minStock: 200, unitPrice: 1600000, status: 'good', lastUpdated: '26/07/2025' },
    { id: 'm2', code: 'VT-002', name: 'Thép D20 Hòa Phát', categoryId: 'c2', categoryName: 'Sắt thép', unitId: 'u2', unitName: 'Kg', inStock: 25000, minStock: 5000, unitPrice: 15500, status: 'low', lastUpdated: '25/07/2025' },
    { id: 'm3', code: 'VT-003', name: 'Cát vàng', categoryId: 'c1', categoryName: 'Vật liệu xây dựng', unitId: 'u3', unitName: 'm3', inStock: 450, minStock: 100, unitPrice: 450000, status: 'good', lastUpdated: '26/07/2025' },
  ]);

  // --- STATE FOR MODALS ---
  // Material Modal
  const [isMatModalOpen, setIsMatModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  
  // Group Modal
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Category | null>(null);

  // Delete Confirm Modal State
  const [deleteData, setDeleteData] = useState<{ isOpen: boolean; id: string; type: 'material' | 'group'; name: string }>({
      isOpen: false,
      id: '',
      type: 'material',
      name: ''
  });

  // --- FORM DATA STATE ---
  const [matForm, setMatForm] = useState<Partial<Material>>({});
  const [groupForm, setGroupForm] = useState<Partial<Category>>({});

  // --- HANDLERS FOR MATERIAL ---
  const openAddMaterial = () => {
    setEditingMaterial(null);
    setMatForm({
      code: '', name: '', categoryId: '', unitId: '', 
      inStock: 0, minStock: 0, unitPrice: 0, status: 'good'
    });
    setIsMatModalOpen(true);
  };

  const openEditMaterial = (m: Material) => {
    setEditingMaterial(m);
    setMatForm({ ...m });
    setIsMatModalOpen(true);
  };

  const saveMaterial = () => {
    if (!matForm.name || !matForm.code) return alert('Vui lòng nhập tên và mã vật tư');
    
    // Find related names
    const cat = categories.find(c => c.id === matForm.categoryId);
    const unit = units.find(u => u.id === matForm.unitId);

    const finalData: Material = {
      ...matForm as Material,
      id: editingMaterial ? editingMaterial.id : `m_${Date.now()}`,
      categoryName: cat?.name || '',
      unitName: unit?.name || '',
      lastUpdated: new Date().toLocaleDateString('vi-VN'),
      status: (matForm.inStock || 0) <= 0 ? 'out' : (matForm.inStock || 0) < (matForm.minStock || 0) ? 'low' : 'good'
    };

    if (editingMaterial) {
      setMaterials(prev => prev.map(m => m.id === finalData.id ? finalData : m));
    } else {
      setMaterials(prev => [...prev, finalData]);
    }
    setIsMatModalOpen(false);
  };

  const initiateDeleteMaterial = (m: Material) => {
    setDeleteData({ isOpen: true, id: m.id, type: 'material', name: m.name });
  };

  // --- HANDLERS FOR GROUP ---
  const openAddGroup = () => {
    setEditingGroup(null);
    setGroupForm({ code: '', name: '', description: '', type: 'material' });
    setIsGroupModalOpen(true);
  };

  const openEditGroup = (c: Category) => {
    setEditingGroup(c);
    setGroupForm({ ...c });
    setIsGroupModalOpen(true);
  };

  const saveGroup = () => {
    if (!groupForm.name || !groupForm.code) return alert('Vui lòng nhập tên và mã nhóm');
    
    const finalData: Category = {
      ...groupForm as Category,
      id: editingGroup ? editingGroup.id : `c_${Date.now()}`,
      type: 'material'
    };

    if (editingGroup) {
      setCategories(prev => prev.map(c => c.id === finalData.id ? finalData : c));
      // Update related materials category name if needed
      setMaterials(prev => prev.map(m => m.categoryId === finalData.id ? { ...m, categoryName: finalData.name } : m));
    } else {
      setCategories(prev => [...prev, finalData]);
    }
    setIsGroupModalOpen(false);
  };

  const initiateDeleteGroup = (c: Category) => {
    setDeleteData({ isOpen: true, id: c.id, type: 'group', name: c.name });
  };

  const handleConfirmDelete = () => {
      if (deleteData.type === 'material') {
        setMaterials(prev => prev.filter(m => m.id !== deleteData.id));
      } else {
        setCategories(prev => prev.filter(c => c.id !== deleteData.id));
      }
  };


  // --- FILTER LOGIC ---
  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || m.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center shrink-0">
        <div>
           <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Kho Vật tư Tổng hợp</h2>
           <p className="text-sm text-slate-500 mt-1">Quản lý danh mục, tồn kho và nhóm vật tư.</p>
        </div>
      </div>

      {/* Internal Tabs */}
      <div className="flex border-b border-slate-200 shrink-0">
        <button 
          onClick={() => setActiveTab('list')}
          className={`px-6 py-3 text-sm font-bold transition-all relative ${activeTab === 'list' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Danh sách Vật tư
          {activeTab === 'list' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('groups')}
          className={`px-6 py-3 text-sm font-bold transition-all relative ${activeTab === 'groups' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Nhóm Vật tư
          {activeTab === 'groups' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>}
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-b-3xl rounded-tr-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col flex-1 min-h-0 border-t-0 mt-0">
        
        {/* TAB 1: MATERIAL LIST */}
        {activeTab === 'list' && (
          <>
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2 w-full md:w-auto">
                 <div className="relative group flex-1 md:w-80">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"><Icons.Search /></span>
                    <input 
                       type="text" 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       placeholder="Tìm tên hoặc mã VT..."
                       className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                    />
                 </div>
                 <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:border-blue-500 hover:bg-slate-50 cursor-pointer"
                 >
                    <option value="all">Tất cả nhóm</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
              </div>
              
              <div className="flex gap-2">
                 <button onClick={openAddMaterial} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 transition-colors">
                    <Icons.Plus /> Thêm mới
                 </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <table className="w-full text-left min-w-[900px]">
                 <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest sticky top-0 z-20">
                    <tr>
                       <th className="px-6 py-4">Mã VT</th>
                       <th className="px-6 py-4">Tên vật tư</th>
                       <th className="px-6 py-4">Phân loại</th>
                       <th className="px-6 py-4">ĐVT</th>
                       <th className="px-6 py-4 text-center">Tồn kho</th>
                       <th className="px-6 py-4 text-right">Đơn giá</th>
                       <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {filteredMaterials.map(item => (
                       <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4">
                             <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold">{item.code}</span>
                          </td>
                          <td className="px-6 py-4">
                             <p className="text-sm font-bold text-slate-700">{item.name}</p>
                             <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${item.status === 'good' ? 'bg-emerald-500' : item.status === 'low' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                                <span className="text-[10px] text-slate-400">{item.status === 'good' ? 'Sẵn sàng' : item.status === 'low' ? 'Sắp hết' : 'Hết hàng'}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-600">{item.categoryName}</td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-600">{item.unitName}</td>
                          <td className="px-6 py-4 text-center text-sm font-bold text-slate-800">
                             {item.inStock.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-xs font-medium text-slate-600">
                             {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => openEditMaterial(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Icons.Edit /></button>
                                <button onClick={() => initiateDeleteMaterial(item)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Icons.Delete /></button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
            </div>
          </>
        )}

        {/* TAB 2: MATERIAL GROUPS */}
        {activeTab === 'groups' && (
           <>
            <div className="p-4 border-b border-slate-100 flex justify-end bg-white sticky top-0 z-10">
               <button onClick={openAddGroup} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 transition-colors">
                  <Icons.Plus /> Thêm nhóm
               </button>
            </div>
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest sticky top-0">
                      <tr>
                          <th className="px-6 py-4">Mã nhóm</th>
                          <th className="px-6 py-4">Tên nhóm</th>
                          <th className="px-6 py-4">Mô tả</th>
                          <th className="px-6 py-4 text-right">Thao tác</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {categories.map(c => (
                          <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                              <td className="px-6 py-4"><span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{c.code}</span></td>
                              <td className="px-6 py-4 font-bold text-slate-800">{c.name}</td>
                              <td className="px-6 py-4 text-sm text-slate-500">{c.description}</td>
                              <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => openEditGroup(c)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Icons.Edit /></button>
                                    <button onClick={() => initiateDeleteGroup(c)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Icons.Delete /></button>
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
            </div>
           </>
        )}
      </div>

      {/* --- MATERIAL POPUP MODAL --- */}
      {isMatModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-bold text-slate-800">{editingMaterial ? 'Chỉnh sửa Vật tư' : 'Thêm Vật tư mới'}</h3>
                  <button onClick={() => setIsMatModalOpen(false)} className="text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              </div>
              <div className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-700 uppercase">Mã VT <span className="text-rose-500">*</span></label>
                       <input type="text" value={matForm.code} onChange={e => setMatForm({...matForm, code: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-700 uppercase">Tên Vật tư <span className="text-rose-500">*</span></label>
                       <input type="text" value={matForm.name} onChange={e => setMatForm({...matForm, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-700 uppercase">Nhóm</label>
                       <select value={matForm.categoryId} onChange={e => setMatForm({...matForm, categoryId: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none">
                          <option value="">-- Chọn nhóm --</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-700 uppercase">Đơn vị</label>
                       <select value={matForm.unitId} onChange={e => setMatForm({...matForm, unitId: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none">
                          <option value="">-- Chọn ĐVT --</option>
                          {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                       </select>
                    </div>
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-700 uppercase">Tồn kho</label>
                       <input type="number" value={matForm.inStock} onChange={e => setMatForm({...matForm, inStock: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-700 uppercase">Định mức Min</label>
                       <input type="number" value={matForm.minStock} onChange={e => setMatForm({...matForm, minStock: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-700 uppercase">Đơn giá</label>
                       <input type="number" value={matForm.unitPrice} onChange={e => setMatForm({...matForm, unitPrice: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" />
                    </div>
                 </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                 <button onClick={() => setIsMatModalOpen(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50">Hủy</button>
                 <button onClick={saveMaterial} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">Lưu thông tin</button>
              </div>
           </div>
        </div>
      )}

      {/* --- GROUP POPUP MODAL --- */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-bold text-slate-800">{editingGroup ? 'Sửa Nhóm Vật tư' : 'Thêm Nhóm mới'}</h3>
                  <button onClick={() => setIsGroupModalOpen(false)} className="text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              </div>
              <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-700 uppercase">Mã Nhóm <span className="text-rose-500">*</span></label>
                       <input type="text" value={groupForm.code} onChange={e => setGroupForm({...groupForm, code: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-700 uppercase">Tên Nhóm <span className="text-rose-500">*</span></label>
                       <input type="text" value={groupForm.name} onChange={e => setGroupForm({...groupForm, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-700 uppercase">Mô tả</label>
                       <textarea value={groupForm.description} onChange={e => setGroupForm({...groupForm, description: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none h-20 resize-none"></textarea>
                  </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                 <button onClick={() => setIsGroupModalOpen(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50">Hủy</button>
                 <button onClick={saveGroup} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">Lưu</button>
              </div>
           </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      <ConfirmModal 
        isOpen={deleteData.isOpen}
        onClose={() => setDeleteData({ ...deleteData, isOpen: false })}
        onConfirm={handleConfirmDelete}
        message={
          <span>
            Bạn có muốn xóa {deleteData.type === 'material' ? 'vật tư' : 'nhóm'} <b>[{deleteData.name}]</b> không?
            {deleteData.type === 'group' && <br/>}
            {deleteData.type === 'group' && <span className="text-xs text-rose-500 italic">Lưu ý: Các vật tư thuộc nhóm này cũng có thể bị ảnh hưởng.</span>}
          </span>
        }
      />
    </div>
  );
};

export default MaterialManager;
