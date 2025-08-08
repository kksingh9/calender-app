# Month View Task Planner

A modern, interactive calendar application for task management with drag & drop functionality, built with React, TypeScript, and Tailwind CSS.

## Features

### 🎯 Core Functionality
- **Month View Calendar**: Clean, grid-based calendar interface
- **Drag & Drop Task Creation**: Click and drag across days to create tasks
- **Task Rescheduling**: Drag tasks to move them to different dates
- **Task Resizing**: Stretch task edges to adjust start/end dates
- **Task Categories**: Organize tasks with color-coded categories
- **Real-time Filtering**: Filter tasks by category and time range

### 🎨 Task Categories
- **To Do** (Blue) - New tasks to be started
- **In Progress** (Amber) - Tasks currently being worked on
- **Review** (Purple) - Tasks under review
- **Completed** (Green) - Finished tasks

### 🔧 Interactive Features
- **Task Creation**: Drag across consecutive days to create multi-day tasks
- **Task Movement**: Drag tasks to reschedule them while maintaining duration
- **Task Resizing**: Hover over task edges to resize start/end dates
- **Modal Interface**: Clean modal for task naming and category selection
- **Visual Feedback**: Live preview during drag operations

### 📊 Filtering System
- **Category Filters**: Multi-select checkboxes for task categories
- **Time Filters**: Single-select options for time-based filtering
  - Tasks within 1 week
  - Tasks within 2 weeks
  - Tasks within 3 weeks
  - All tasks (no time filter)

### 💾 Data Persistence
- **Local Storage**: Tasks are automatically saved to browser storage
- **Session Persistence**: Data persists between browser sessions
- **No Backend Required**: Fully client-side application

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd calender-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Usage Guide

### Creating Tasks
1. **Drag Selection**: Click and drag across multiple consecutive days in the calendar
2. **Task Modal**: A modal will appear asking for task name and category
3. **Task Creation**: Fill in the details and click "Create"

### Managing Tasks
- **Move Tasks**: Click and drag a task to a different date
- **Resize Tasks**: Hover over task edges and drag to adjust duration
- **View Details**: Tasks show in calendar cells with color-coded indicators

### Filtering Tasks
- **Category Filter**: Use the left sidebar to filter by task categories
- **Time Filter**: Select time-based filters to show relevant tasks
- **Combined Filters**: Filters work together for precise task viewing

### Demo Mode
- Click "Add Sample Tasks" in the demo banner to populate the calendar with example tasks
- This helps demonstrate the application's functionality

## Technical Details

### Tech Stack
- **React 19**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool and dev server

### Architecture
- **Component-Based**: Modular, reusable components
- **State Management**: React hooks for local state
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Mobile-friendly interface


