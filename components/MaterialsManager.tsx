import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { Material, MaterialInventory } from '../types';
import * as materialService from '../services/materialService';

type TabType = 'materials' | 'inventory' | 'transactions';

const MaterialsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('materials');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [inventories, setInventories] = useState<MaterialInventory[]>([]);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    categoryId: '',
    unit: '',
    unitPrice: '',
    description: '',
    notes: '',
  });

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const data = await materialService.getMaterials();
      setMaterials(data);
      if (activeTab === 'inventory') {
        const invData = await materialService.getMaterialInventories();
        setInventories(invData);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInventories = async () => {
    setLoading(true);
    try {
      const invData = await materialService.getMaterialInventories();
      setInventories(invData);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = async (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'inventory') {
      await loadInventories();
    }
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name || !formData.categoryId) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      if (editingId) {
        await materialService.updateMaterial(editingId, {
          code: formData.code,
          name: formData.name,
          categoryId: formData.categoryId,
          unit: formData.unit,
          unitPrice: Number(formData.unitPrice),
          description: formData.description,
          notes: formData.notes,
        });
      } else {
        await materialService.addMaterial({
          code: formData.code,
          name: formData.name,
          categoryId: formData.categoryId,
          unit: formData.unit,
          unitPrice: Number(formData.unitPrice),
          description: formData.description,
          notes: formData.notes,
        });
      }
      resetForm();
      await loadMaterials();
    } catch (error) {
      console.error('Lỗi khi lưu vật tư:', error);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm('Bạn chắc chắn muốn xóa vật tư này?')) return;
    try {
      await materialService.deleteMaterial(id);
      await loadMaterials();
    } catch (error) {
      console.error('Lỗi khi xóa vật tư:', error);
    }
  };

  const handleEditMaterial = (material: Material) => {
    setFormData({
      code: material.code,
      name: material.name,
      categoryId: material.categoryId,
      unit: material.unit,
      unitPrice: String(material.unitPrice),
      description: material.description || '',
      notes: material.notes || '',
    });
    setEditingId(material.id);
    setShowAddMaterial(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      categoryId: '',
      unit: '',
      unitPrice: '',
      description: '',
      notes: '',
    });
    setEditingId(null);
    setShowAddMaterial(false);
  };

  const filteredMaterials = materials.filter(m =>
    m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInventories = inventories.filter(inv =>
    inv.materialCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.materialName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Quản Lý Vật Tư</h1>
          <p className="text-slate-600">Quản lý danh sách vật tư, tồn kho và giao dịch vật tư</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => handleTabChange('materials')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'materials'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Danh Sách Vật Tư
          </button>
          <button
            onClick={() => handleTabChange('inventory')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'inventory'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Tồn Kho
          </button>
          <button
            onClick={() => handleTabChange('transactions')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'transactions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Giao Dịch
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'materials' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm">
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <div className="relative">
                  <Icons.Search />
                  <input
                    type="text"
                    placeholder="Tìm kiếm mã hoặc tên vật tư..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddMaterial(true);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold whitespace-nowrap"
              >
                <Icons.Plus />
                Thêm Vật Tư
              </button>
            </div>

            {/* Add/Edit Material Form */}
            {showAddMaterial && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Chỉnh Sửa' : 'Thêm'} Vật Tư</h3>
                <form onSubmit={handleAddMaterial} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Mã vật tư"
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value})}
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Tên vật tư"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                  <select
                    value={formData.categoryId}
                    onChange={e => setFormData({...formData, categoryId: e.target.value})}
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="1">Vật liệu xây dựng</option>
                    <option value="2">Sắt thép</option>
                    <option value="3">Gỗ và gỗ công nghiệp</option>
                    <option value="4">Sơn và keo</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Đơn vị tính"
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Giá đơn vị"
                    value={formData.unitPrice}
                    onChange={e => setFormData({...formData, unitPrice: e.target.value})}
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <textarea
                    placeholder="Mô tả"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="md:col-span-2 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 h-20"
                  />
                  <div className="md:col-span-2 flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      {editingId ? 'Cập Nhật' : 'Thêm Vật Tư'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Materials Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Mã</th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Tên Vật Tư</th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Danh Mục</th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Đơn Vị</th>
                      <th className="px-6 py-3 text-right text-sm font-bold text-slate-700">Giá Đơn Vị</th>
                      <th className="px-6 py-3 text-center text-sm font-bold text-slate-700">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {loading ? (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Đang tải...</td></tr>
                    ) : filteredMaterials.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Không có vật tư nào</td></tr>
                    ) : (
                      filteredMaterials.map(material => (
                        <tr key={material.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm font-semibold text-slate-800">{material.code}</td>
                          <td className="px-6 py-4 text-sm text-slate-700">{material.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{material.categoryName}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{material.unit}</td>
                          <td className="px-6 py-4 text-sm text-slate-700 text-right font-semibold">
                            {Number(material.unitPrice).toLocaleString('vi-VN')} đ
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleEditMaterial(material)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Chỉnh sửa"
                              >
                                <Icons.Edit />
                              </button>
                              <button
                                onClick={() => handleDeleteMaterial(material.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa"
                              >
                                <Icons.Delete />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm">
              <div className="flex-1 relative">
                <Icons.Search />
                <input
                  type="text"
                  placeholder="Tìm kiếm tồn kho..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Mã Vật Tư</th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Tên Vật Tư</th>
                      <th className="px-6 py-3 text-right text-sm font-bold text-slate-700">Tồn Kho</th>
                      <th className="px-6 py-3 text-right text-sm font-bold text-slate-700">Đã Sử Dụng</th>
                      <th className="px-6 py-3 text-right text-sm font-bold text-slate-700">Còn Lại</th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Nơi Lưu Trữ</th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Cập Nhật</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {loading ? (
                      <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">Đang tải...</td></tr>
                    ) : filteredInventories.length === 0 ? (
                      <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">Không có dữ liệu tồn kho</td></tr>
                    ) : (
                      filteredInventories.map(inv => {
                        const percentage = inv.quantity > 0 ? (inv.usedQuantity / inv.quantity) * 100 : 0;
                        return (
                          <tr key={inv.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 text-sm font-semibold text-slate-800">{inv.materialCode}</td>
                            <td className="px-6 py-4 text-sm text-slate-700">{inv.materialName}</td>
                            <td className="px-6 py-4 text-sm text-right text-slate-700 font-semibold">
                              {inv.quantity} {inv.unit}
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-slate-700">
                              {inv.usedQuantity} {inv.unit}
                            </td>
                            <td className="px-6 py-4 text-sm text-right font-semibold">
                              <span className={inv.availableQuantity > 0 ? 'text-green-600' : 'text-red-600'}>
                                {inv.availableQuantity} {inv.unit}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{inv.location}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{inv.lastUpdated}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Icons.Search />
                <input
                  type="text"
                  placeholder="Tìm kiếm giao dịch..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="text-center text-slate-500 py-8">
              <p className="text-sm">Chức năng quản lý giao dịch vật tư đang được phát triển</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsManager;
