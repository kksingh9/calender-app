import React, { useState } from 'react';
import type { TaskCategory } from '../types';
import { X } from 'lucide-react';

interface TaskModalProps {
  onClose: () => void;
  onSubmit: (taskData: { name: string; category: string }) => void;
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
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md border border-gray-200">
        <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>
        <button onClick={onClose} className="cursor-pointer text-gray-500 hover:text-gray-700 mb-4">
          <X className="w-5 h-5" />
        </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task name"
              autoFocus
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option className="cursor-pointer " key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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