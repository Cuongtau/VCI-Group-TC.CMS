
import React from 'react';
import { Task } from '../types';

interface GanttChartProps {
  tasks: Task[];
  startDate: string;
  endDate: string;
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks, startDate, endDate }) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const totalDuration = end - start;

  const flattenedTasks: Task[] = [];
  const flatten = (tList: Task[]) => {
    tList.forEach(t => {
      flattenedTasks.push(t);
      if (t.subTasks && t.isExpanded) flatten(t.subTasks);
    });
  };
  flatten(tasks);

  const getPosition = (dateStr: string) => {
    const d = new Date(dateStr).getTime();
    return ((d - start) / totalDuration) * 100;
  };

  const getWidth = (startStr: string, endStr: string) => {
    const s = new Date(startStr).getTime();
    const e = new Date(endStr).getTime();
    return Math.max(2, ((e - s) / totalDuration) * 100);
  };

  // Generate timeline months
  const months = [];
  const currDate = new Date(startDate);
  const endD = new Date(endDate);
  while (currDate <= endD) {
    months.push(new Date(currDate));
    currDate.setMonth(currDate.getMonth() + 1);
  }

  return (
    <div className="flex flex-col h-full bg-white select-none">
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <div className="min-w-[1200px] h-full">
          {/* Header Timeline */}
          <div className="h-12 border-b border-slate-100 flex relative bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
            {months.map((m, i) => (
              <div key={i} className="flex-1 border-r border-slate-200/50 flex flex-col items-center justify-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  Tháng {m.getMonth() + 1}
                </span>
                <span className="text-[8px] font-bold text-slate-300">
                  {m.getFullYear()}
                </span>
              </div>
            ))}
          </div>

          {/* Task Bars Content Area */}
          <div className="py-4 relative min-h-full">
             {/* Today Indicator (Simplified Placeholder) */}
             <div className="absolute top-0 bottom-0 w-px bg-rose-500/30 z-0 left-[35%] pointer-events-none">
                <div className="bg-rose-500 text-white text-[8px] px-1 py-0.5 rounded-b font-bold absolute top-0 -left-[14px]">HÔM NAY</div>
             </div>

            {flattenedTasks.map((task, idx) => {
              const left = Math.max(0, getPosition(task.startDate));
              const width = Math.min(100 - left, getWidth(task.startDate, task.endDate));

              return (
                <div key={task.id} className={`h-10 flex items-center relative group hover:bg-blue-50/20 transition-colors`}>
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {months.map((_, i) => (
                      <div key={i} className="flex-1 border-r border-slate-50 h-full opacity-50"></div>
                    ))}
                  </div>
                  
                  {/* The Gantt Bar */}
                  <div 
                    className={`absolute h-4 rounded-full shadow-md flex items-center transition-all group-hover:h-5 cursor-pointer z-10 ${
                      task.level === 1 ? 'bg-blue-700' : 
                      task.level === 2 ? 'bg-blue-500' : 
                      'bg-slate-300'
                    }`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                  >
                    {/* Progress Fill */}
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        task.progress === 100 ? 'bg-emerald-500' : 
                        task.progress > 0 ? 'bg-emerald-400' : 'bg-transparent'
                      }`}
                      style={{ width: `${task.progress}%` }}
                    ></div>
                    
                    {/* Floating Info Tooltip on Hover */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-8 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl font-bold">
                       {task.name}: {task.progress}%
                    </div>

                    {/* Percentage Label */}
                    {width > 8 && (
                      <span className="absolute left-full ml-3 text-[9px] text-slate-500 font-black whitespace-nowrap">
                        {task.progress}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
