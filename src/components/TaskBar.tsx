import React from 'react';
import type { Task } from '../types';
import { getCategoryColor } from '../utils/calendarUtils';

interface TaskBarProps {
  task: Task;
  style?: React.CSSProperties;
  onMouseDown: (e: React.MouseEvent, edge?: 'start' | 'end') => void;
}

const TaskBar: React.FC<TaskBarProps> = ({ task, style, onMouseDown }) => {
  const color = getCategoryColor(task.category);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMouseDown(e);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMouseDown(e, 'start');
  };

  const handleResizeEnd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMouseDown(e, 'end');
  };

  return (
    <div
      className="relative group cursor-move"
      style={style}
      onMouseDown={handleMouseDown}
    >
      <div
        className="h-full rounded px-2 py-1 text-xs font-medium text-white flex items-center justify-between"
        style={{ backgroundColor: color }}
      >
        <span className="truncate flex-1">{task.name}</span>
        
        {/* Resize handles */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div
            className="w-1 h-3 bg-white bg-opacity-50 rounded cursor-ew-resize hover:bg-opacity-75"
            onMouseDown={handleResizeStart}
          />
          <div
            className="w-1 h-3 bg-white bg-opacity-50 rounded cursor-ew-resize hover:bg-opacity-75"
            onMouseDown={handleResizeEnd}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskBar; 