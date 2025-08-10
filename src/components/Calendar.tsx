import React, { useState, useRef } from 'react';
import type { Task, DragState, TaskCategory } from '../types';
import { getMonthData, isToday, isSameDay, getTasksForDate, generateId, getCategoryColor } from '../utils/calendarUtils';
import TaskModal from './TaskModal.tsx';
import TaskBar from './TaskBar.tsx';

interface CalendarProps {
  tasks: Task[];
  onTaskCreate: (task: Task) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ tasks, onTaskCreate, onTaskUpdate }) => {
  const [currentDate] = useState(new Date());
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startDate: null,
    endDate: null,
    taskId: null,
    dragType: null,
    resizeEdge: null
  });
  const [showModal, setShowModal] = useState(false);
  const [pendingTask, setPendingTask] = useState<Partial<Task> | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const calendarRef = useRef<HTMLDivElement>(null);

  const monthData = getMonthData(currentDate.getFullYear(), currentDate.getMonth());
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleMouseDown = (e: React.MouseEvent, date: Date, taskId?: string, edge?: 'start' | 'end') => {
    e.preventDefault();
    
    if (taskId) {
      // Resizing or moving existing task
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      setDraggedTask(task);
      setDragState({
        isDragging: true,
        startDate: date,
        endDate: date,
        taskId,
        dragType: edge ? 'resize' : 'move',
        resizeEdge: edge || null
      });
    } else {
      // Creating new task
      setDragState({
        isDragging: true,
        startDate: date,
        endDate: date,
        taskId: null,
        dragType: 'create',
        resizeEdge: null
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState.isDragging || !calendarRef.current) return;

    const rect = calendarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate which day cell we're over
    const cellWidth = rect.width / 7;
    const cellHeight = rect.height / 6;
    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);
    const dayIndex = row * 7 + col;
    
    if (dayIndex >= 0 && dayIndex < monthData.length) {
      const newDate = monthData[dayIndex];
      
      if (dragState.dragType === 'create') {
        setDragState(prev => ({
          ...prev,
          endDate: newDate
        }));
      } else if (dragState.dragType === 'move' && draggedTask) {
        const duration = Math.ceil((new Date(draggedTask.endDate).getTime() - new Date(draggedTask.startDate).getTime()) / (1000 * 60 * 60 * 24));
        const newStartDate = new Date(newDate);
        const newEndDate = new Date(newDate);
        newEndDate.setDate(newStartDate.getDate() + duration - 1);
        
        setDragState(prev => ({
          ...prev,
          startDate: newStartDate,
          endDate: newEndDate
        }));
      } else if (dragState.dragType === 'resize' && draggedTask) {
        if (dragState.resizeEdge === 'start') {
          // Ensure start date doesn't go beyond end date
          const currentEndDate = new Date(draggedTask.endDate);
          if (newDate <= currentEndDate) {
            setDragState(prev => ({
              ...prev,
              startDate: newDate
            }));
          }
        } else if (dragState.resizeEdge === 'end') {
          // Ensure end date doesn't go before start date
          const currentStartDate = new Date(draggedTask.startDate);
          if (newDate >= currentStartDate) {
            setDragState(prev => ({
              ...prev,
              endDate: newDate
            }));
          }
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (!dragState.isDragging) return;

    if (dragState.dragType === 'create' && dragState.startDate && dragState.endDate) {
      // Create new task
      const startDate = new Date(Math.min(dragState.startDate.getTime(), dragState.endDate.getTime()));
      const endDate = new Date(Math.max(dragState.startDate.getTime(), dragState.endDate.getTime()));
      
      setPendingTask({
        startDate,
        endDate
      });
      setShowModal(true);
    } else if (dragState.dragType === 'move' && draggedTask && dragState.startDate) {
      // Move existing task
      const duration = Math.ceil((new Date(draggedTask.endDate).getTime() - new Date(draggedTask.startDate).getTime()) / (1000 * 60 * 60 * 24));
      const newStartDate = new Date(dragState.startDate);
      const newEndDate = new Date(dragState.startDate);
      newEndDate.setDate(newStartDate.getDate() + duration - 1);
      
      onTaskUpdate(draggedTask.id, {
        startDate: newStartDate,
        endDate: newEndDate
      });
    } else if (dragState.dragType === 'resize' && draggedTask && dragState.startDate && dragState.endDate) {
      // Resize existing task
      const startDate = new Date(Math.min(dragState.startDate.getTime(), dragState.endDate.getTime()));
      const endDate = new Date(Math.max(dragState.startDate.getTime(), dragState.endDate.getTime()));
      
      onTaskUpdate(draggedTask.id, {
        startDate,
        endDate
      });
    }

    setDragState({
      isDragging: false,
      startDate: null,
      endDate: null,
      taskId: null,
      dragType: null,
      resizeEdge: null
    });
    setDraggedTask(null);
  };

  const handleTaskCreate = (taskData: { name: string; category: TaskCategory }) => {
    if (editingTask) {
      // Editing existing task
      onTaskUpdate(editingTask.id, {
        name: taskData.name,
        category: taskData.category
      });
      setShowModal(false);
      setEditingTask(null);
    } else if (pendingTask) {
      // Creating new task
      const newTask: Task = {
        id: generateId(),
        name: taskData.name,
        category: taskData.category,
        startDate: pendingTask.startDate!,
        endDate: pendingTask.endDate!,
        color: getCategoryColor(taskData.category)
      };
      
      onTaskCreate(newTask);
      setShowModal(false);
      setPendingTask(null);
    }
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const renderTaskBars = () => {
    const taskBars: React.ReactElement[] = [];
    
    tasks.forEach(task => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      
      // Find the grid positions for this task
      const startIndex = monthData.findIndex(date => isSameDay(date, taskStart));
      const endIndex = monthData.findIndex(date => isSameDay(date, taskEnd));
      
      if (startIndex !== -1 && endIndex !== -1) {
        const startCol = startIndex % 7;
        const startRow = Math.floor(startIndex / 7);
        const endCol = endIndex % 7;
        const endRow = Math.floor(endIndex / 7);
        
        // Only render if task spans multiple days in the same row
        if (startRow === endRow) {
          const left = (startCol / 7) * 100;
          const width = ((endCol - startCol + 1) / 7) * 100;
          const top = (startRow / 6) * 100 + 20;
          
          taskBars.push(
            <TaskBar
              key={task.id}
              task={task}
              style={{
                position: 'absolute',
                left: `${left}%`,
                top: `${top}%`,
                width: `${width}%`,
                height: '20px',
                zIndex: 10
              }}
              onMouseDown={(e: React.MouseEvent, edge?: 'start' | 'end') => handleMouseDown(e, taskStart, task.id, edge)}
              onClick={handleTaskEdit}
            />
          );
        }
      }
    });
    
    return taskBars;
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h1>
      </div>
      
      <div 
        ref={calendarRef}
        className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Resize info display */}
        {dragState.isDragging && dragState.dragType === 'resize' && draggedTask && dragState.startDate && dragState.endDate && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg z-20">
            <div className="text-sm font-medium">
              {dragState.resizeEdge === 'start' ? 'Resizing Start Date' : 'Resizing End Date'}
            </div>
            <div className="text-xs opacity-90">
              {dragState.startDate.toLocaleDateString()} - {dragState.endDate.toLocaleDateString()}
            </div>
          </div>
        )}

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* Header */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
          
          {/* Days */}
          {monthData.map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isTodayDate = isToday(date);
            const dayTasks = getTasksForDate(tasks, date);
            
            return (
              <div
                key={index}
                className={`cursor-pointer min-h-[80px] p-2 bg-white relative ${
                  !isCurrentMonth ? 'text-gray-400' : 'text-gray-900'
                } ${isTodayDate ? 'bg-blue-50 border-2 border-blue-300' : ''}`}
                onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, date)}
              >
                <div className="text-sm font-medium mb-1">
                  {date.getDate()}
                </div>
                
                {/* Task indicators */}
                <div className="space-y-1">
                  {dayTasks.slice(0, 2).map(task => (
                    <div
                      key={task.id}
                      className="text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: task.color + '20', color: task.color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskEdit(task);
                      }}
                    >
                      {task.name}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Task bars overlay */}
        {renderTaskBars()}
        
        {/* Drag selection overlay */}
        {dragState.isDragging && dragState.dragType === 'create' && dragState.startDate && dragState.endDate && (
          <div
            className="absolute bg-blue-200 opacity-50 cursor-move"
            style={{
              left: `${(Math.min(monthData.findIndex(d => isSameDay(d, dragState.startDate!)), 
                              monthData.findIndex(d => isSameDay(d, dragState.endDate!))) % 7) / 7 * 100}%`,
              top: `${Math.floor(Math.min(monthData.findIndex(d => isSameDay(d, dragState.startDate!)), 
                                         monthData.findIndex(d => isSameDay(d, dragState.endDate!))) / 7) / 6 * 100 + 20}%`,
              width: `${(Math.abs(monthData.findIndex(d => isSameDay(d, dragState.startDate!)) - 
                                 monthData.findIndex(d => isSameDay(d, dragState.endDate!))) + 1) / 7 * 100}%`,
              height: '20px'
            }}
          />
        )}

        {/* Resize preview overlay */}
        {dragState.isDragging && dragState.dragType === 'resize' && draggedTask && dragState.startDate && dragState.endDate && (
          <div
            className="absolute bg-blue-300 opacity-70 cursor-ew-resize border-2 border-blue-500"
            style={{
              left: `${(Math.min(monthData.findIndex(d => isSameDay(d, dragState.startDate!)), 
                              monthData.findIndex(d => isSameDay(d, dragState.endDate!))) % 7) / 7 * 100}%`,
              top: `${Math.floor(Math.min(monthData.findIndex(d => isSameDay(d, dragState.startDate!)), 
                                         monthData.findIndex(d => isSameDay(d, dragState.endDate!))) / 7) / 6 * 100 + 20}%`,
              width: `${(Math.abs(monthData.findIndex(d => isSameDay(d, dragState.startDate!)) - 
                                 monthData.findIndex(d => isSameDay(d, dragState.endDate!))) + 1) / 7 * 100}%`,
              height: '20px'
            }}
          >
            {/* Resize edge indicator */}
            <div className="absolute inset-0 flex items-center justify-between px-1">
              {dragState.resizeEdge === 'start' && (
                <div className="w-1 h-4 bg-blue-600 rounded-full animate-pulse" />
              )}
              {dragState.resizeEdge === 'end' && (
                <div className="w-1 h-4 bg-blue-600 rounded-full animate-pulse ml-auto" />
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Task Creation/Editing Modal */}
      {showModal && (pendingTask || editingTask) && (
        <TaskModal
          onClose={() => {
            setShowModal(false);
            setPendingTask(null);
            setEditingTask(null);
          }}
          onSubmit={handleTaskCreate}
          task={editingTask ? { name: editingTask.name, category: editingTask.category } : undefined}
        />
      )}
    </div>
  );
};

export default Calendar; 