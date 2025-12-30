
import React, { useState } from 'react';
import { Icons } from '../../constants';
import { Material } from '../../types';

const MaterialTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock data
  const [materials, setMaterials] = useState<Material[]>([
    { id: 'm1', code: 'VT-001', name: 'Xi măng PCB40', categoryId: 'c1', categoryName: 'Vật liệu xây dựng', unitId: 'u1', unitName: 'Tấn', inStock: 150, minStock: 20, unitPrice: 1600000, status: 'good', lastUpdated: '26/07/2025' },
    { id: 'm2', code: 'VT-002', name: 'Thép D20 Hòa Phát', categoryId: 'c2', categoryName: 'Sắt thép', unitId: 'u2', unitName: 'Kg', inStock: 2500, minStock: 5000, unitPrice: 15500, status: 'low', lastUpdated: '25/07/2025' },
    { id: 'm3', code: 'VT-003', name: 'Cát vàng', categoryId: 'c1', categoryName: 'Vật liệu xây dựng', unitId: 'u3', unitName: 'm3', inStock: 45, minStock: 10, unitPrice: 450000, status: 'good', lastUpdated: '26/07/2025' },
    { id: 'm4', code: 'VT-004', name: 'Gạch ống 4 lỗ', categoryId: 'c3', categoryName: 'Gạch', unitId: 'u4', unitName: 'Viên', inStock: 0, minStock: 10000, unitPrice: 1200, status: 'out', lastUpdated: '20/07/2025' },
    { id: 'm5', code: 'VT-005', name: 'Sơn nội thất trắng', categoryId: 'c4', categoryName: 'Hoàn thiện', unitId: 'u5', unitName: 'Thùng 18L', inStock: 12, minStock: 5, unitPrice: 1250000, status: 'good', lastUpdated: '24/07/2025' },
  ]);

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || m.categoryName === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(materials.map(m => m.categoryName)));

  // Statistics
  const totalItems = materials.length;
  const lowStockItems = materials.filter(m => m.status === 'low' || m.status === 'out').length;
  const totalValue = materials.reduce((acc, m) => acc + (m.inStock * m.unitPrice), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in h-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổng loại vật tư</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{totalItems}</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Icons.Cube />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cần nhập thêm</p>
              <div className="flex items-center gap-2 mt-1">
                <h3 className="text-2xl font-black text-rose-600">{lowStockItems}</h3>
                <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">Cảnh báo</span>
              </div>
            </div>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giá trị tồn kho</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{formatCurrency(totalValue)}</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <span className="text-lg font-bold">₫</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 w-full md:w-auto">
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest hidden md:block mr-2">Kho vật tư</h3>
             <div className="relative group flex-1 md:w-64">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"><Icons.Search /></span>
                <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder="Tìm tên hoặc mã VT..."
                   className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                />
             </div>
             <div className="relative">
                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:border-blue-500 hover:bg-slate-50 cursor-pointer"
                >
                   <option value="all">Tất cả nhóm</option>
                   {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><Icons.ChevronDown /></div>
             </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
             <button className="flex-1 md:flex-none px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center justify-center gap-2 transition-colors">
                <Icons.Upload /> Nhập kho
             </button>
             <button className="flex-1 md:flex-none px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center justify-center gap-2 transition-colors">
                <Icons.Download /> Xuất kho
             </button>
             <button className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-colors">
                <Icons.Plus /> Mới
             </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
             <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                   <th className="px-6 py-4">Mã VT</th>
                   <th className="px-6 py-4">Tên vật tư</th>
                   <th className="px-6 py-4">Phân loại</th>
                   <th className="px-6 py-4">ĐVT</th>
                   <th className="px-6 py-4 text-center">Tồn kho</th>
                   <th className="px-6 py-4 text-right">Đơn giá</th>
                   <th className="px-6 py-4 text-right">Thành tiền</th>
                   <th className="px-6 py-4 text-center">Trạng thái</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {filteredMaterials.map(item => (
                   <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                         <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold">{item.code}</span>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{item.name}</p>
                         <p className="text-[10px] text-slate-400">Cập nhật: {item.lastUpdated}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">{item.categoryName}</td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">{item.unitName}</td>
                      <td className="px-6 py-4">
                         <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-bold text-slate-800">{item.inStock.toLocaleString()}</span>
                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                               <div 
                                  className={`h-full rounded-full ${item.status === 'good' ? 'bg-emerald-500' : item.status === 'low' ? 'bg-amber-500' : 'bg-rose-500'}`}
                                  style={{ width: `${Math.min(100, (item.inStock / (item.minStock * 2)) * 100)}%` }}
                               ></div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right text-xs font-medium text-slate-600">
                         {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-slate-800">
                         {formatCurrency(item.unitPrice * item.inStock)}
                      </td>
                      <td className="px-6 py-4 text-center">
                         {item.status === 'good' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Sẵn sàng</span>}
                         {item.status === 'low' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Sắp hết</span>}
                         {item.status === 'out' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">Hết hàng</span>}
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
        </div>
        
        {/* Pagination Mock */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-white">
           <p className="text-xs text-slate-500 font-medium">Hiển thị <span className="font-bold text-slate-800">{filteredMaterials.length}</span> vật tư</p>
           <div className="flex gap-1">
              <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50"><div className="rotate-90"><Icons.ChevronDown /></div></button>
              <button className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-blue-600 text-xs font-bold">2</button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-blue-600"><Icons.ChevronRight /></button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialTab;
