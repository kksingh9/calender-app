import React, { useState } from 'react';
import type { TaskCategory } from '../types';
import { X } from 'lucide-react';
import { getCategoryColor } from '../utils/calendarUtils';

interface TaskModalProps {
  onClose: () => void;
  onSubmit: (taskData: { name: string; category: TaskCategory }) => void;
  task?: {
    name: string;
    category: TaskCategory;
  };
}

const TaskModal: React.FC<TaskModalProps> = ({ onClose, onSubmit, task }) => {
  const [name, setName] = useState(task?.name || '');
  const [category, setCategory] = useState<TaskCategory>(task?.category || 'To Do');

  const categories: TaskCategory[] = ['To Do', 'In Progress', 'Review', 'Completed'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ name: name.trim(), category });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md border border-gray-200 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter task name"
              autoFocus
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map(cat => {
                const isSelected = category === cat;
                const color = getCategoryColor(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className={`text-sm font-medium ${
                        isSelected ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {cat}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal; 