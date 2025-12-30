
import React from 'react';
import { Task, TaskStatus } from '../types';
import { Icons } from '../constants';

interface TaskTableProps {
  tasks: Task[];
  onToggleExpand: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (parentId: string | null) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onToggleExpand, onUpdateTask, onDeleteTask, onAddTask }) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED: return 'bg-emerald-100 text-emerald-700';
      case TaskStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700';
      case TaskStatus.DELAYED: return 'bg-rose-100 text-rose-700';
      case TaskStatus.NOT_STARTED: return 'bg-slate-100 text-slate-700';
    }
  };

  const renderTaskRows = (taskList: Task[]) => {
    return taskList.map((task) => (
      <React.Fragment key={task.id}>
        <tr className={`border-b border-slate-100 hover:bg-blue-50/30 group transition-colors ${task.level === 1 ? 'font-bold bg-slate-50/20' : ''}`}>
          <td className="px-3 py-2.5">
            <div className="flex items-center" style={{ paddingLeft: `${(task.level - 1) * 12}px` }}>
              {(task.subTasks && task.subTasks.length > 0) ? (
                <button 
                  onClick={() => onToggleExpand(task.id)}
                  className="mr-1 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {task.isExpanded ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
                </button>
              ) : (
                <div className="w-5 h-5 mr-1"></div>
              )}
              <span className="text-xs text-slate-700 truncate max-w-[150px]" title={task.name}>{task.name}</span>
            </div>
          </td>
          <td className="px-2 py-2.5 text-[10px] text-slate-500 font-mono hidden md:table-cell">{task.code}</td>
          <td className="px-2 py-2.5">
            <input 
              type="date" 
              value={task.startDate} 
              onChange={(e) => onUpdateTask(task.id, { startDate: e.target.value })}
              className="text-[10px] bg-transparent border-none p-0 focus:ring-0 text-slate-600 cursor-pointer hover:text-blue-600 w-full"
            />
          </td>
          <td className="px-2 py-2.5">
            <input 
              type="date" 
              value={task.endDate} 
              onChange={(e) => onUpdateTask(task.id, { endDate: e.target.value })}
              className="text-[10px] bg-transparent border-none p-0 focus:ring-0 text-slate-600 cursor-pointer hover:text-blue-600 w-full"
            />
          </td>
          <td className="px-2 py-2.5">
            <div className="flex items-center gap-1.5">
              <input 
                type="number" 
                value={task.progress} 
                onChange={(e) => onUpdateTask(task.id, { progress: parseInt(e.target.value) || 0 })}
                className="w-8 text-right text-[10px] font-bold bg-transparent border-none p-0 focus:ring-0 text-blue-600"
              />
              <span className="text-[9px] font-bold text-slate-400">%</span>
            </div>
          </td>
          <td className="px-2 py-2.5 text-right">
            <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onAddTask(task.id)}
                className="p-1 text-blue-500 hover:bg-blue-100 rounded"
                title="Thêm HM con"
              >
                <Icons.Plus />
              </button>
              <button 
                onClick={() => onDeleteTask(task.id)}
                className="p-1 text-rose-500 hover:bg-rose-100 rounded"
                title="Xóa"
              >
                <Icons.Delete />
              </button>
            </div>
          </td>
        </tr>
        {task.isExpanded && task.subTasks && renderTaskRows(task.subTasks)}
      </React.Fragment>
    ));
  };

  return (
    <div className="bg-white overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse table-fixed min-w-[500px]">
          <thead className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-3 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[180px]">Hạng mục</th>
              <th className="px-2 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[70px] hidden md:table-cell">Mã</th>
              <th className="px-2 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[90px]">Bắt đầu</th>
              <th className="px-2 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[90px]">Kết thúc</th>
              <th className="px-2 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[60px]">Tiến độ</th>
              <th className="px-2 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right w-[60px]">Sửa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {renderTaskRows(tasks)}
            <tr className="hover:bg-blue-50/50 cursor-pointer transition-colors" onClick={() => onAddTask(null)}>
              <td colSpan={6} className="px-4 py-4 text-center text-blue-600 text-[10px] font-bold uppercase tracking-widest border-t border-dashed border-blue-100">
                <div className="flex items-center justify-center gap-2">
                  <Icons.Plus /> <span>Hạng mục Cấp 1 Mới</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
