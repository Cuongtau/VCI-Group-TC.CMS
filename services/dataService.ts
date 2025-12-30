
import { Project, Task, TaskStatus } from '../types';

export const mockProjects: Project[] = [
  {
    id: 'P001',
    name: 'Xây dựng Cầu Mỹ Thuận 2',
    code: 'MT2-2024',
    manager: 'Trần Hồng Hà',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    description: 'Dự án trọng điểm hạ tầng giao thông đồng bằng sông Cửu Long'
  },
  {
    id: 'P002',
    name: 'Tòa nhà Văn phòng TechHub',
    code: 'TH-01',
    manager: 'Phạm Minh Đức',
    startDate: '2023-05-15',
    endDate: '2024-11-20',
    description: 'Xây dựng tổ hợp văn phòng thông minh tại Đà Nẵng'
  }
];

export const getMockTasks = (projectId: string): Task[] => {
  return [
    {
      id: 'T1',
      projectId,
      name: 'PHẦN MÓNG & CỌC',
      code: '01.MONG',
      level: 1,
      parentId: null,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      progress: 100,
      status: TaskStatus.COMPLETED,
      assignee: 'Nguyễn Văn An',
      isExpanded: true,
      subTasks: [
        {
          id: 'T1.1',
          projectId,
          name: 'Thi công cọc khoan nhồi',
          code: '01.01.COC',
          level: 2,
          parentId: 'T1',
          startDate: '2024-01-01',
          endDate: '2024-02-15',
          progress: 100,
          status: TaskStatus.COMPLETED,
          assignee: 'Lê Văn Bình',
          isExpanded: true,
          subTasks: [
            {
              id: 'T1.1.1',
              projectId,
              name: 'Vận chuyển thiết bị máy móc',
              code: '01.01.01.VC',
              level: 3,
              parentId: 'T1.1',
              startDate: '2024-01-01',
              endDate: '2024-01-05',
              progress: 100,
              status: TaskStatus.COMPLETED,
              assignee: 'Đội thi công 1',
            },
            {
              id: 'T1.1.2',
              projectId,
              name: 'Khoan tạo lỗ và đặt lồng thép',
              code: '01.01.02.KH',
              level: 3,
              parentId: 'T1.1',
              startDate: '2024-01-06',
              endDate: '2024-02-15',
              progress: 100,
              status: TaskStatus.COMPLETED,
              assignee: 'Đội thi công 1',
            }
          ]
        },
        {
          id: 'T1.2',
          projectId,
          name: 'Đào đất hố móng',
          code: '01.02.DAO',
          level: 2,
          parentId: 'T1',
          startDate: '2024-02-16',
          endDate: '2024-03-10',
          progress: 100,
          status: TaskStatus.COMPLETED,
          assignee: 'Trần Văn Cường',
        }
      ]
    },
    {
      id: 'T2',
      projectId,
      name: 'KẾT CẤU THÂN',
      code: '02.THAN',
      level: 1,
      parentId: null,
      startDate: '2024-04-01',
      endDate: '2024-10-30',
      progress: 45,
      status: TaskStatus.IN_PROGRESS,
      assignee: 'Hoàng Văn Dũng',
      isExpanded: true,
      subTasks: [
        {
          id: 'T2.1',
          projectId,
          name: 'Thi công dầm sàn tầng 1',
          code: '02.01.S1',
          level: 2,
          parentId: 'T2',
          startDate: '2024-04-01',
          endDate: '2024-04-20',
          progress: 100,
          status: TaskStatus.COMPLETED,
          assignee: 'Đội thi công 2',
        },
        {
          id: 'T2.2',
          projectId,
          name: 'Thi công dầm sàn tầng 2',
          code: '02.02.S2',
          level: 2,
          parentId: 'T2',
          startDate: '2024-04-21',
          endDate: '2024-05-15',
          progress: 80,
          status: TaskStatus.IN_PROGRESS,
          assignee: 'Đội thi công 2',
        }
      ]
    },
    {
      id: 'T3',
      projectId,
      name: 'HOÀN THIỆN',
      code: '03.HT',
      level: 1,
      parentId: null,
      startDate: '2024-11-01',
      endDate: '2025-06-30',
      progress: 0,
      status: TaskStatus.NOT_STARTED,
      assignee: 'Lý Thu Thảo',
    }
  ];
};
