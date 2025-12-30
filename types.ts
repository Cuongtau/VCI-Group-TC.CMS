
export enum TaskStatus {
  NOT_STARTED = 'Chưa bắt đầu',
  IN_PROGRESS = 'Đang thi công',
  COMPLETED = 'Đã hoàn thành',
  DELAYED = 'Chậm tiến độ'
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  code: string;
  level: number;
  parentId: string | null;
  startDate: string;
  endDate: string;
  progress: number; // 0 to 100
  status: TaskStatus;
  assignee: string;
  subTasks?: Task[];
  isExpanded?: boolean;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  manager: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface DailyLog {
  id: string;
  taskId: string;
  date: string;
  content: string;
  images?: string[];
  actualProgress: number;
  notes: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success';
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

// --- Project Details Specific Types ---

export interface Role { 
  id: string; 
  name: string; 
  memberCount: number; 
  description?: string; 
}

export interface OrgMember { 
  id: string; 
  name: string; 
  roleId: string; 
  roleTitle: string; 
  email: string; 
  phone: string; 
  avatar: string; 
}

export interface WorkDay { 
  id: string; 
  label: string; 
  hours: number; 
  isActive: boolean; 
}

export interface PermissionModule { 
  id: string; 
  label: string; 
  level: number;
  isExpanded?: boolean;
  parentId?: string | null;
  permissions: { view: boolean; add: boolean; edit: boolean; delete: boolean; }; 
}

export interface HistoryEntry { 
  id: string; 
  time: string; 
  date: string; 
  user: string; 
  action: string; 
  type: 'create' | 'edit' | 'status' | 'delete'; 
}

export interface Contract { 
  id: string; 
  code: string; 
  name: string; 
  value: string; 
  date: string; 
  status: 'active' | 'pending' | 'liquidated'; 
  files: number; 
}

export interface Appendix { 
  id: string; 
  code: string; 
  contractId: string; 
  name: string; 
  adjustValue: string; 
  date: string; 
}

export interface ProjectInfo {
  code: string;
  name: string;
  type: string;
  phase: string;
  startDate: string;
  endDate: string;
  manager: string;
  location: string;
  description: string;
}

// --- Resources & Config ---

export interface Material {
  id: string;
  code: string;
  name: string;
  categoryId: string; // Updated reference
  categoryName: string;
  unitId: string; // Updated reference
  unitName: string;
  inStock: number;
  minStock: number;
  unitPrice: number;
  status: 'good' | 'low' | 'out';
  lastUpdated: string;
  description?: string;
}

export interface Equipment {
  id: string;
  code: string;
  name: string;
  type: string;
  status: 'available' | 'in_use' | 'maintenance' | 'broken';
  location: string; // Project ID or Warehouse
  purchaseDate: string;
  value: number;
}

export interface Unit {
  id: string;
  name: string;
  description?: string;
  isSystem?: boolean; // System default units cannot be deleted
}

export interface Category {
  id: string;
  code: string;
  name: string;
  type: 'material' | 'equipment';
  description?: string;
}

export type DataScopeType = 'personal' | 'department' | 'all';
