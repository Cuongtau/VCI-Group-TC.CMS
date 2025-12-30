
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
    return Math.max(0.5, ((e - s) / totalDuration) * 100);
  };

  // Generate timeline headers
  const months = [];
  const currDate = new Date(startDate);
  // Set to first day of month to align correctly
  currDate.setDate(1); 
  const endD = new Date(endDate);
  
  while (currDate <= endD) {
    months.push(new Date(currDate));
    currDate.setMonth(currDate.getMonth() + 1);
  }

  return (
    <div className="flex flex-col h-full bg-white select-none">
      <div className="flex-1 overflow-auto custom-scrollbar relative bg-slate-50/30">
        <div className="min-w-[1200px] h-full flex flex-col">
          {/* Header Timeline */}
          <div className="h-14 border-b border-slate-200 flex relative bg-white sticky top-0 z-20 shadow-sm">
            {months.map((m, i) => (
              <div key={i} className="flex-1 border-r border-slate-100 flex flex-col items-start justify-center px-2 group hover:bg-slate-50 transition-colors">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-blue-500">
                  {m.getFullYear()}
                </span>
                <span className="text-xs font-bold text-slate-700">
                  Tháng {m.getMonth() + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Grid & Task Bars Content Area */}
          <div className="relative flex-1 py-2">
            {/* Background Grid Lines */}
             <div className="absolute inset-0 flex pointer-events-none z-0">
                {months.map((_, i) => (
                  <div key={i} className="flex-1 border-r border-slate-100/80 h-full">
                    {/* Optional: Add weekly dashed lines inside month if needed */}
                  </div>
                ))}
             </div>
             
             {/* Today Line Indicator */}
             <div className="absolute top-0 bottom-0 w-px bg-rose-500 z-0 left-[35%] pointer-events-none opacity-60">
                <div className="bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded-b font-bold absolute top-0 -left-[20px] shadow-sm">TODAY</div>
             </div>

            {flattenedTasks.map((task, idx) => {
              const left = Math.max(0, getPosition(task.startDate));
              const width = Math.min(100 - left, getWidth(task.startDate, task.endDate));
              const isParent = task.subTasks && task.subTasks.length > 0;

              return (
                <div key={task.id} className={`h-9 flex items-center relative group hover:bg-blue-50/40 transition-colors border-b border-slate-50/50`}>
                  {/* The Gantt Bar */}
                  <div 
                    className={`absolute h-5 rounded-md shadow-sm flex items-center transition-all cursor-pointer z-10 hover:shadow-lg hover:scale-[1.01] hover:brightness-105 ${
                      task.status === 'Đã hoàn thành' ? 'opacity-90' : ''
                    } ${
                        task.level === 1 ? 'bg-slate-800 h-2 mt-2 rounded-full' : // Parent simplified
                        task.level === 2 ? 'bg-blue-600' : 
                        'bg-sky-400'
                    }`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    title={`${task.name}: ${task.startDate} -> ${task.endDate}`}
                  >
                    {/* Progress Fill (only for normal bars) */}
                    {task.level > 1 && (
                        <div 
                        className={`h-full rounded-l-md transition-all duration-1000 bg-white/20`}
                        style={{ width: `${task.progress}%` }}
                        ></div>
                    )}
                    
                    {/* Floating Info Tooltip on Hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl font-medium flex flex-col items-center">
                       <span className="font-bold">{task.name}</span>
                       <span className="text-[9px] text-slate-300">{task.startDate} - {task.endDate} ({task.progress}%)</span>
                       {/* Little Triangle */}
                       <div className="w-2 h-2 bg-slate-800 rotate-45 absolute -bottom-1"></div>
                    </div>

                    {/* Label next to bar */}
                    {width > 0 && (
                      <span className={`absolute left-full ml-2 text-[10px] font-bold whitespace-nowrap ${task.progress === 100 ? 'text-emerald-600' : 'text-slate-500'}`}>
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
