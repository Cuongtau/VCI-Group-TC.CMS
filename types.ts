
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
