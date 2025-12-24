import { useCallback, useState } from 'react';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  projectId: string;
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_PROJECT: Project = {
  id: 'inbox',
  name: 'Inbox',
  color: '#0a7ea4',
};

const PROJECT_COLORS = ['#0a7ea4', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c'];

let todos: Todo[] = [];
let projects: Project[] = [DEFAULT_PROJECT];
let listeners: Set<() => void> = new Set();

const notify = () => listeners.forEach((l) => l());

export function useTodoStore() {
  const [, forceUpdate] = useState({});

  const subscribe = useCallback(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  return {
    todos,
    projects,
    addTodo: (title: string, projectId = 'inbox') => {
      todos = [...todos, { id: Date.now().toString(), title, completed: false, projectId, createdAt: Date.now() }];
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
    getTodosByProject: (projectId: string) => todos.filter((t) => t.projectId === projectId),
    getProjectById: (id: string) => projects.find((p) => p.id === id),
  };
}
