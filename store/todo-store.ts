import { useCallback, useState } from 'react';

export type Priority = 'none' | 'low' | 'medium' | 'high';
export type SortOption = 'created' | 'priority' | 'alphabetical';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  projectId: string;
  createdAt: number;
  priority: Priority;
  subtasks: Subtask[];
  tagIds: string[];
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_PROJECT: Project = { id: 'inbox', name: 'Inbox', color: '#0a7ea4' };
const DEFAULT_TAGS: Tag[] = [
  { id: 'work', name: 'Work', color: '#e74c3c' },
  { id: 'personal', name: 'Personal', color: '#3498db' },
  { id: 'urgent', name: 'Urgent', color: '#f39c12' },
];
const PROJECT_COLORS = ['#0a7ea4', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c'];
const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2, none: 3 };

let todos: Todo[] = [];
let projects: Project[] = [DEFAULT_PROJECT];
let tags: Tag[] = DEFAULT_TAGS;
let sortOption: SortOption = 'created';
let listeners: Set<() => void> = new Set();

const notify = () => listeners.forEach((l) => l());

const sortTodos = (list: Todo[]): Todo[] => {
  return [...list].sort((a, b) => {
    if (sortOption === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (sortOption === 'alphabetical') return a.title.localeCompare(b.title);
    return b.createdAt - a.createdAt;
  });
};

export function useTodoStore() {
  const [, forceUpdate] = useState({});

  const subscribe = useCallback(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  useState(() => subscribe());

  return {
    todos: sortTodos(todos),
    projects,
    tags,
    sortOption,
    addTodo: (title: string, projectId = 'inbox', priority: Priority = 'none') => {
      todos = [...todos, { id: Date.now().toString(), title, completed: false, projectId, createdAt: Date.now(), priority, subtasks: [], tagIds: [] }];
      notify();
    },
    toggleTodo: (id: string) => {
      todos = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      notify();
    },
    deleteTodo: (id: string) => {
      todos = todos.filter((t) => t.id !== id);
      notify();
    },
    updateTodoPriority: (id: string, priority: Priority) => {
      todos = todos.map((t) => (t.id === id ? { ...t, priority } : t));
      notify();
    },
    addSubtask: (todoId: string, title: string) => {
      todos = todos.map((t) => t.id === todoId ? { ...t, subtasks: [...t.subtasks, { id: Date.now().toString(), title, completed: false }] } : t);
      notify();
    },
    toggleSubtask: (todoId: string, subtaskId: string) => {
      todos = todos.map((t) => t.id === todoId ? { ...t, subtasks: t.subtasks.map((s) => s.id === subtaskId ? { ...s, completed: !s.completed } : s) } : t);
      notify();
    },
    deleteSubtask: (todoId: string, subtaskId: string) => {
      todos = todos.map((t) => t.id === todoId ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) } : t);
      notify();
    },
    toggleTag: (todoId: string, tagId: string) => {
      todos = todos.map((t) => {
        if (t.id !== todoId) return t;
        const hasTag = t.tagIds.includes(tagId);
        return { ...t, tagIds: hasTag ? t.tagIds.filter((id) => id !== tagId) : [...t.tagIds, tagId] };
      });
      notify();
    },
    addTag: (name: string, color: string) => {
      tags = [...tags, { id: Date.now().toString(), name, color }];
      notify();
    },
    deleteTag: (id: string) => {
      tags = tags.filter((t) => t.id !== id);
      todos = todos.map((t) => ({ ...t, tagIds: t.tagIds.filter((tid) => tid !== id) }));
      notify();
    },
    setSortOption: (option: SortOption) => {
      sortOption = option;
      notify();
    },
    addProject: (name: string) => {
      const color = PROJECT_COLORS[projects.length % PROJECT_COLORS.length];
      projects = [...projects, { id: Date.now().toString(), name, color }];
      notify();
    },
    deleteProject: (id: string) => {
      if (id === 'inbox') return;
      projects = projects.filter((p) => p.id !== id);
      todos = todos.filter((t) => t.projectId !== id);
      notify();
    },
    getTodosByProject: (projectId: string) => sortTodos(todos.filter((t) => t.projectId === projectId)),
    getProjectById: (id: string) => projects.find((p) => p.id === id),
    getTagById: (id: string) => tags.find((t) => t.id === id),
  };
}
