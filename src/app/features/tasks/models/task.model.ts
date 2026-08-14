export type TaskCategory = 'work' | 'personal' | 'study' | 'other';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatusFilter = 'all' | 'completed' | 'pending';
export type TaskSort = 'manual' | 'newest' | 'oldest' | 'title' | 'priority' | 'dueDate';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  category: TaskCategory;
  priority: TaskPriority;
  position: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTask {
  title: string;
  dueDate?: string | null;
  category?: TaskCategory;
  priority?: TaskPriority;
}

export interface UpdateTask {
  title?: string;
  completed?: boolean;
  dueDate?: string | null;
  category?: TaskCategory;
  priority?: TaskPriority;
}

export interface PagedTasks {
  items: Task[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  pendingCount?: number;
  completedCount?: number;
}
