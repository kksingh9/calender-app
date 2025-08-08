import { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import type { Task, FilterState } from './types';
import { filterTasks } from './utils/calendarUtils';
import Calendar from './components/Calendar';
import FilterPanel from './components/FilterPanel';
// import DemoData from './components/DemoData';

function App() {
  function loadTasksFromLocalStorage(): Task[] {
    try {
      const saved = localStorage.getItem('calendar-tasks');
      if (!saved) return [];
      return JSON.parse(saved).map((task: any) => ({
        ...task,
        startDate: new Date(task.startDate),
        endDate: new Date(task.endDate),
      }));
    } catch (e) {
      console.error('Failed to load tasks:', e);
      return [];
    }
  }
  
  const [tasks, setTasks] = useState<Task[]>(loadTasksFromLocalStorage);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    timeFilter: null
  });


  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('calendar-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskCreate = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // const handleAddSampleTasks = (sampleTasks: Task[]) => {
  //   setTasks(prev => [...prev, ...sampleTasks]);
  // };

  const filteredTasks = filterTasks(tasks, filters);

  return (
    <DndContext>
      <div className="min-h-screen bg-gray-50">
        {/* Demo Data Banner */}
        {/* <DemoData onAddTasks={handleAddSampleTasks} /> */}
        
        <div className="flex h-screen">
          {/* Filter Panel */}
          <FilterPanel 
            filters={filters}
            onFiltersChange={setFilters}
          />
          
          {/* Calendar */}
          <Calendar
            tasks={filteredTasks}
            onTaskCreate={handleTaskCreate}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
          />
        </div>
      </div>
    </DndContext>
  );
}

export default App;
