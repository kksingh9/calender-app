import type { Task, TaskCategory, FilterState } from '../types';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameDay as fnIsSameDay,
  isToday as fnIsToday,
  getDaysInMonth as fnGetDaysInMonth,
  format as formatFn,
  isWithinInterval,
  addWeeks,
} from 'date-fns';

export const getMonthData = (year: number, month: number) => {
  const firstDay = startOfMonth(new Date(year, month, 1));
  const lastDay = endOfMonth(new Date(year, month, 1));
  const gridStart = startOfWeek(firstDay, { weekStartsOn: 0 });

  const days: Date[] = [];
  for (let i = 0; i < 42; i += 1) {
    days.push(addDays(gridStart, i));
  }

  // Ensure the grid covers the last day of month
  const coversLastDay = days.some((d) => fnIsSameDay(d, lastDay));
  if (!coversLastDay) {
    const last = days[days.length - 1];
    const extraDays = [] as Date[];
    let i = 1;
    while (!fnIsSameDay(addDays(last, i), lastDay)) {
      extraDays.push(addDays(last, i));
      i += 1;
    }
    extraDays.push(lastDay);
    return [...days, ...extraDays].slice(0, 42);
  }

  return days;
};

export const isSameDay = (date1: Date, date2: Date) => fnIsSameDay(date1, date2);

export const isToday = (date: Date) => fnIsToday(date);

export const getDaysInMonth = (year: number, month: number) => fnGetDaysInMonth(new Date(year, month, 1));

export const formatDate = (date: Date) => formatFn(date, 'MMM d');

export const getCategoryColor = (category: TaskCategory): string => {
  const colors = {
    'To Do': '#3B82F6',
    'In Progress': '#F59E0B',
    'Review': '#8B5CF6',
    'Completed': '#10B981'
  } as const;
  return colors[category];
};

export const filterTasks = (tasks: Task[], filters: FilterState): Task[] => {
  let filteredTasks = tasks;

  // Filter by search term (task name)
  if (filters.searchTerm.trim()) {
    const searchLower = filters.searchTerm.toLowerCase().trim();
    filteredTasks = filteredTasks.filter(task => 
      task.name.toLowerCase().includes(searchLower)
    );
  }

  if (filters.categories.length > 0) {
    filteredTasks = filteredTasks.filter(task => 
      filters.categories.includes(task.category)
    );
  }

  if (filters.timeFilter) {
    const now = new Date();
    const weeks = parseInt(filters.timeFilter, 10);
    const futureDate = addWeeks(now, weeks);

    filteredTasks = filteredTasks.filter(task => {
      const taskStart = new Date(task.startDate);
      return taskStart >= now && taskStart <= futureDate;
    });
  }

  return filteredTasks;
};

export const getTasksForDate = (tasks: Task[], date: Date): Task[] => {
  return tasks.filter(task => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    return isWithinInterval(date, { start: taskStart, end: taskEnd });
  });
};

export const generateId = (): string => {
  return Math.random().toString(36).slice(2, 11);
}; 