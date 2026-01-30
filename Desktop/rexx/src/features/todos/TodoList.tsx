import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle, Target } from 'lucide-react';
import { useTodoStore } from '../../store/useTodoStore';
import type { Todo } from '../../store/useTodoStore';
import { Button, Input, Card } from '../../components/ui';

interface TodoListProps {
    isFocusMode?: boolean;
}

export const TodoList = ({ isFocusMode = false }: TodoListProps) => {
    const [text, setText] = useState('');
    const { todos, addTodo, toggleTodo, deleteTodo, activeTodoId, setActiveTodo } = useTodoStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            addTodo(text.trim());
            setText('');
        }
    };

    const activeTodo = todos.find(t => t.id === activeTodoId);

    return (
        <motion.div
            className="flex flex-col gap-6 h-full"
            animate={{
                opacity: isFocusMode && !activeTodo ? 0.3 : 1,
                filter: isFocusMode && !activeTodo ? 'blur(2px)' : 'blur(0px)',
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
            {/* Active Task Banner */}
            <AnimatePresence mode="wait">
                {activeTodo && !activeTodo.completed && (
                    <motion.div
                        key="active-banner"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <Card className="border-accent/20 bg-accent/5">
                            <div className="flex items-center gap-4">
                                <motion.div
                                    className="p-3 bg-accent/10 rounded-xl text-accent"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut'
                                    }}
                                >
                                    <Target size={24} />
                                </motion.div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-accent uppercase tracking-wider">Şu an Odaklanılan</p>
                                    <h3 className="text-lg font-bold text-white break-words">{activeTodo.text}</h3>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setActiveTodo(null)}
                                    className="text-xs"
                                >
                                    Vazgeç
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Todo */}
            <motion.form
                onSubmit={handleSubmit}
                className="flex gap-2"
                animate={{
                    opacity: isFocusMode ? 0.3 : 1,
                }}
                transition={{ duration: 0.4 }}
                role="form"
                aria-label="Yeni görev ekleme formu"
            >
                <Input
                    placeholder="Yeni görev ekle..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    aria-label="Yeni görev metni"
                />
                <Button
                    type="submit"
                    className="shrink-0 aspect-square p-0 w-12"
                    aria-label="Görev ekle"
                    title="Görev ekle"
                >
                    <Plus size={20} />
                </Button>
            </motion.form>

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5">
                {todos.length === 0 ? (
                    <motion.div
                        className="text-center py-12 text-text-dim text-sm italic"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Henüz görev eklenmemiş. Bir tane ekleyerek başla!
                    </motion.div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {todos.map((todo, index) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                index={index}
                                isActive={todo.id === activeTodoId}
                                isFocusMode={isFocusMode}
                                onToggle={() => toggleTodo(todo.id)}
                                onDelete={() => deleteTodo(todo.id)}
                                onFocus={() => setActiveTodo(todo.id)}
                            />
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </motion.div>
    );
};

const TodoItem = ({
    todo,
    index,
    isActive,
    isFocusMode,
    onToggle,
    onDelete,
    onFocus
}: {
    todo: Todo;
    index: number;
    isActive: boolean;
    isFocusMode: boolean;
    onToggle: () => void;
    onDelete: () => void;
    onFocus: () => void;
}) => {
    const shouldDim = isFocusMode && !isActive && !todo.completed;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{
                opacity: shouldDim ? 0.3 : 1,
                x: 0,
                filter: shouldDim ? 'blur(1px)' : 'blur(0px)',
            }}
            exit={{
                opacity: 0,
                x: 100,
                scale: 0.8,
                transition: { duration: 0.2 }
            }}
            transition={{
                duration: 0.3,
                delay: index * 0.05,
                layout: { duration: 0.3, ease: 'easeInOut' }
            }}
            className={`group flex items-center gap-3 p-3 rounded-xl transition-all border mb-3 ${isActive
                ? 'bg-white/5 border-accent/30'
                : 'bg-transparent border-transparent hover:border-white/5 hover:bg-white/5'
                }`}
        >
            <motion.button
                onClick={onToggle}
                className={`shrink-0 transition-colors ${todo.completed ? 'text-accent' : 'text-text-dim hover:text-white'}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                aria-label={todo.completed ? `${todo.text} tamamlandı olarak işaretle` : `${todo.text} tamamla`}
                aria-checked={todo.completed}
                role="checkbox"
            >
                {todo.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </motion.button>

            <span className={`flex-1 text-sm font-medium transition-all break-words ${todo.completed ? 'text-text-dim line-through' : 'text-text-main'
                }`}>
                {todo.text}
            </span>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!todo.completed && !isActive && (
                    <motion.button
                        onClick={onFocus}
                        className="p-2 text-text-dim hover:text-accent transition-colors"
                        title="Odaklan"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={`${todo.text} görevine odaklan`}
                    >
                        <Target size={16} />
                    </motion.button>
                )}
                <motion.button
                    onClick={onDelete}
                    className="p-2 text-text-dim hover:text-red-500 transition-colors"
                    title="Sil"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`${todo.text} görevini sil`}
                >
                    <Trash2 size={16} />
                </motion.button>
            </div>
        </motion.div>
    );
};
