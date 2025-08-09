export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  startDate: Date;
  endDate: Date;
  color: string;
}

export type TaskCategory = 'To Do' | 'In Progress' | 'Review' | 'Completed';

export interface FilterState {
  categories: TaskCategory[];
  timeFilter: '1week' | '2weeks' | '3weeks' | null;
  searchTerm: string;
}

export interface DragState {
  isDragging: boolean;
  startDate: Date | null;
  endDate: Date | null;
  taskId: string | null;
  dragType: 'create' | 'move' | 'resize' | null;
  resizeEdge: 'start' | 'end' | null;
} 