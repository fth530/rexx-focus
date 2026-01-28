import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useStatsStore } from './useStatsStore';

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
}

interface TodoState {
    todos: Todo[];
    activeTodoId: string | null;
    addTodo: (text: string) => void;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
    setActiveTodo: (id: string | null) => void;
}

export const useTodoStore = create<TodoState>()(
    persist(
        (set) => ({
            todos: [],
            activeTodoId: null,
            addTodo: (text) => set((state) => ({
                todos: [
                    ...state.todos,
                    {
                        id: crypto.randomUUID(),
                        text,
                        completed: false,
                        createdAt: Date.now(),
                    }
                ]
            })),
            toggleTodo: (id) => set((state) => {
                const todo = state.todos.find(t => t.id === id);
                const wasCompleted = todo?.completed || false;

                // Track stats when completing (not un-completing)
                if (!wasCompleted) {
                    useStatsStore.getState().incrementTask();
                }

                return {
                    todos: state.todos.map((t) =>
                        t.id === id ? { ...t, completed: !t.completed } : t
                    )
                };
            }),
            deleteTodo: (id) => set((state) => ({
                todos: state.todos.filter((t) => t.id !== id),
                activeTodoId: state.activeTodoId === id ? null : state.activeTodoId
            })),
            setActiveTodo: (id) => set({ activeTodoId: id }),
        }),
        {
            name: 'focus-todos',
        }
    )
);
