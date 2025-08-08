import React from 'react';
import type { FilterState, TaskCategory } from '../types';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange }) => {
  const categories: TaskCategory[] = ['To Do', 'In Progress', 'Review', 'Completed'];
  const timeFilters = [
    { value: '1week', label: 'Tasks within 1 week' },
    { value: '2weeks', label: 'Tasks within 2 weeks' },
    { value: '3weeks', label: 'Tasks within 3 weeks' }
  ];

  const handleCategoryChange = (category: TaskCategory, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handleTimeFilterChange = (value: string | null) => {
    onFiltersChange({
      ...filters,
      timeFilter: value as any
    });
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Filters</h2>
      
      {/* Category Filters */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="cursor-pointer flex items-center">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={(e) => handleCategoryChange(category, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Time Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Time Range</h3>
        <div className="space-y-2">
          {timeFilters.map(filter => (
            <label key={filter.value} className="cursor-pointer flex items-center">
              <input
                type="radio"
                name="timeFilter"
                value={filter.value}
                checked={filters.timeFilter === filter.value}
                onChange={(e) => handleTimeFilterChange(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">{filter.label}</span>
            </label>
          ))}
          <label className="flex items-center">
            <input
              type="radio"
              name="timeFilter"
              value=""
              checked={filters.timeFilter === null}
              onChange={() => handleTimeFilterChange(null)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">All tasks</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 