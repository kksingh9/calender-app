import React from 'react';
import type { Task } from '../types';
import { generateId } from '../utils/calendarUtils';

interface DemoDataProps {
  onAddTasks: (tasks: Task[]) => void;
}

const DemoData: React.FC<DemoDataProps> = ({ onAddTasks }) => {
  const addSampleTasks = () => {
    const today = new Date();
    const sampleTasks: Task[] = [
      {
        id: generateId(),
        name: 'Project Planning',
        category: 'To Do',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
        color: '#3B82F6'
      },
      {
        id: generateId(),
        name: 'Code Review',
        category: 'Review',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
        color: '#8B5CF6'
      },
      {
        id: generateId(),
        name: 'Bug Fixes',
        category: 'In Progress',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
        color: '#F59E0B'
      },
      {
        id: generateId(),
        name: 'Documentation',
        category: 'Completed',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        color: '#10B981'
      }
    ];
    
    onAddTasks(sampleTasks);
  };

  return (
    <div className="p-4 bg-blue-50 border-b border-blue-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-blue-800">Demo Mode</h3>
          <p className="text-xs text-blue-600">Add sample tasks to test the calendar functionality</p>
        </div>
        <button
          onClick={addSampleTasks}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          Add Sample Tasks
        </button>
      </div>
    </div>
  );
};

export default DemoData; 