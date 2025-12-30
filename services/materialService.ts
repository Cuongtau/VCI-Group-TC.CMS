import { Material, MaterialCategory, MaterialInventory, MaterialTransaction } from '../types';

// Mock data for materials
const materialCategories: MaterialCategory[] = [
  { id: '1', name: 'Vật liệu xây dựng', code: 'XD', description: 'Vật liệu dùng trong xây dựng' },
  { id: '2', name: 'Sắt thép', code: 'ST', description: 'Sắt thép và phụ kiện' },
  { id: '3', name: 'Gỗ và gỗ công nghiệp', code: 'GCN', description: 'Gỗ và các sản phẩm gỗ' },
  { id: '4', name: 'Sơn và keo', code: 'SK', description: 'Sơn, keo và các chất phụ trợ' },
];

const materials: Material[] = [
  { id: '1', code: 'THAM001', name: 'Cát xây dựng', categoryId: '1', unit: 'Tấn', unitPrice: 150000, description: 'Cát trắng sạch' },
  { id: '2', code: 'THAM002', name: 'Xi măng Portland', categoryId: '1', unit: 'Tấn', unitPrice: 180000, description: 'Xi măng PCB40' },
  { id: '3', code: 'THAM003', name: 'Cốt thép D10', categoryId: '2', unit: 'Tấn', unitPrice: 8500000, description: 'Cốt thép làm lạnh' },
  { id: '4', code: 'THAM004', name: 'Gạch ốp lát 30x60', categoryId: '1', unit: 'Viên', unitPrice: 25000, description: 'Gạch men bóng' },
  { id: '5', code: 'THAM005', name: 'Sơn trong nước', categoryId: '4', unit: 'Lít', unitPrice: 180000, description: 'Sơn lau chùi được' },
];

const inventories: MaterialInventory[] = [
  { id: '1', materialId: '1', quantity: 50, usedQuantity: 10, availableQuantity: 40, unit: 'Tấn', location: 'Kho A', lastUpdated: '2025-12-29', notes: 'Nhập từ nhà cung cấp X' },
  { id: '2', materialId: '2', quantity: 30, usedQuantity: 5, availableQuantity: 25, unit: 'Tấn', location: 'Kho A', lastUpdated: '2025-12-28' },
  { id: '3', materialId: '3', quantity: 20, usedQuantity: 8, availableQuantity: 12, unit: 'Tấn', location: 'Kho B', lastUpdated: '2025-12-27' },
  { id: '4', materialId: '4', quantity: 5000, usedQuantity: 1200, availableQuantity: 3800, unit: 'Viên', location: 'Kho A', lastUpdated: '2025-12-29' },
  { id: '5', materialId: '5', quantity: 100, usedQuantity: 30, availableQuantity: 70, unit: 'Lít', location: 'Kho C', lastUpdated: '2025-12-26' },
];

const transactions: MaterialTransaction[] = [
  { id: '1', materialId: '1', type: 'import', quantity: 50, unit: 'Tấn', date: '2025-12-20', reason: 'Nhập kho ban đầu', createdBy: 'Nguyễn Văn A', notes: 'Đơn hàng PO001' },
  { id: '2', materialId: '1', type: 'usage', quantity: 10, unit: 'Tấn', date: '2025-12-25', reason: 'Sử dụng cho dự án A', createdBy: 'Trần Văn B' },
  { id: '3', materialId: '2', type: 'import', quantity: 30, unit: 'Tấn', date: '2025-12-15', reason: 'Nhập bổ sung', createdBy: 'Nguyễn Văn A' },
];

// Material Categories
export const getMaterialCategories = async (): Promise<MaterialCategory[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(materialCategories), 300);
  });
};

export const addMaterialCategory = async (category: Omit<MaterialCategory, 'id'>): Promise<MaterialCategory> => {
  return new Promise(resolve => {
    const newCategory: MaterialCategory = {
      id: String(materialCategories.length + 1),
      ...category,
    };
    materialCategories.push(newCategory);
    setTimeout(() => resolve(newCategory), 300);
  });
};

export const updateMaterialCategory = async (id: string, category: Partial<MaterialCategory>): Promise<MaterialCategory> => {
  return new Promise(resolve => {
    const index = materialCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      materialCategories[index] = { ...materialCategories[index], ...category };
      setTimeout(() => resolve(materialCategories[index]), 300);
    }
  });
};

export const deleteMaterialCategory = async (id: string): Promise<void> => {
  return new Promise(resolve => {
    const index = materialCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      materialCategories.splice(index, 1);
    }
    setTimeout(() => resolve(), 300);
  });
};

// Materials
export const getMaterials = async (): Promise<Material[]> => {
  return new Promise(resolve => {
    const withCategories = materials.map(m => {
      const category = materialCategories.find(c => c.id === m.categoryId);
      return { ...m, categoryName: category?.name };
    });
    setTimeout(() => resolve(withCategories), 300);
  });
};

export const addMaterial = async (material: Omit<Material, 'id'>): Promise<Material> => {
  return new Promise(resolve => {
    const newMaterial: Material = {
      id: String(materials.length + 1),
      ...material,
    };
    materials.push(newMaterial);
    setTimeout(() => resolve(newMaterial), 300);
  });
};

export const updateMaterial = async (id: string, material: Partial<Material>): Promise<Material> => {
  return new Promise(resolve => {
    const index = materials.findIndex(m => m.id === id);
    if (index !== -1) {
      materials[index] = { ...materials[index], ...material };
      setTimeout(() => resolve(materials[index]), 300);
    }
  });
};

export const deleteMaterial = async (id: string): Promise<void> => {
  return new Promise(resolve => {
    const index = materials.findIndex(m => m.id === id);
    if (index !== -1) {
      materials.splice(index, 1);
    }
    setTimeout(() => resolve(), 300);
  });
};

// Inventory
export const getMaterialInventories = async (): Promise<MaterialInventory[]> => {
  return new Promise(resolve => {
    const withDetails = inventories.map(inv => {
      const material = materials.find(m => m.id === inv.materialId);
      return {
        ...inv,
        materialName: material?.name,
        materialCode: material?.code,
      };
    });
    setTimeout(() => resolve(withDetails), 300);
  });
};

export const getMaterialInventory = async (materialId: string): Promise<MaterialInventory | undefined> => {
  return new Promise(resolve => {
    const inventory = inventories.find(inv => inv.materialId === materialId);
    setTimeout(() => resolve(inventory), 300);
  });
};

export const updateMaterialInventory = async (id: string, inventory: Partial<MaterialInventory>): Promise<MaterialInventory> => {
  return new Promise(resolve => {
    const index = inventories.findIndex(inv => inv.id === id);
    if (index !== -1) {
      const updated = { ...inventories[index], ...inventory };
      inventories[index] = updated;
      setTimeout(() => resolve(updated), 300);
    }
  });
};

export const addMaterialTransaction = async (transaction: Omit<MaterialTransaction, 'id'>): Promise<MaterialTransaction> => {
  return new Promise(resolve => {
    const newTransaction: MaterialTransaction = {
      id: String(transactions.length + 1),
      ...transaction,
    };
    transactions.push(newTransaction);
    setTimeout(() => resolve(newTransaction), 300);
  });
};

export const getMaterialTransactions = async (materialId?: string): Promise<MaterialTransaction[]> => {
  return new Promise(resolve => {
    let result = [...transactions];
    if (materialId) {
      result = result.filter(t => t.materialId === materialId);
    }
    const withMaterialName = result.map(t => {
      const material = materials.find(m => m.id === t.materialId);
      return { ...t, materialName: material?.name, materialCode: material?.code };
    });
    setTimeout(() => resolve(withMaterialName), 300);
  });
};
