import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import toast from 'react-hot-toast';
import TaskCard from './TaskCard';
import { Task } from '../types';

interface KanbanBoardProps {
  tasks: Task[];
  projectId: string;
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (task: Task) => void;
}

const columns = [
  { 
    id: 'todo', 
    title: 'À Faire', 
    color: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900',
    icon: '📋'
  },
  { 
    id: 'doing', 
    title: 'En Cours', 
    color: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800',
    icon: '⚡'
  },
  { 
    id: 'done', 
    title: 'Terminé', 
    color: 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800',
    icon: '✅'
  },
];

const KanbanColumn: React.FC<{
  id: string;
  title: string;
  color: string;
  icon: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}> = ({ id, title, color, icon, tasks, onTaskClick }) => {
  const { setNodeRef, attributes, listeners } = useSortable({ id });

  return (
    <div 
      ref={setNodeRef} 
      {...attributes}
      className={`column ${color} flex-shrink-0 w-full md:w-80`}
    >
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-300 dark:border-gray-600">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <span className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold px-3 py-1 rounded-full shadow-sm">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto min-h-[400px]">
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <p className="text-sm">Aucune tâche</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task._id} task={task} onClick={() => onTaskClick(task)} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  projectId,
  onTaskClick,
  onTaskUpdate,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const tasksByColumn = {
    todo: tasks.filter((t) => t.column === 'todo').sort((a, b) => a.position - b.position),
    doing: tasks.filter((t) => t.column === 'doing').sort((a, b) => a.position - b.position),
    done: tasks.filter((t) => t.column === 'done').sort((a, b) => a.position - b.position),
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t._id === activeId);
    if (!activeTask) return;

    // Si on dépose directement sur une colonne
    if (['todo', 'doing', 'done'].includes(overId)) {
      const newColumn = overId as 'todo' | 'doing' | 'done';
      if (activeTask.column === newColumn) return;

      try {
        const targetTasks = tasksByColumn[newColumn];
        const newPosition = targetTasks.length;

        const response = await axios.put(`/tasks/${activeId}/move`, {
          column: newColumn,
          position: newPosition,
        });

        onTaskUpdate(response.data);
        toast.success(`Tâche déplacée vers "${columns.find(c => c.id === newColumn)?.title}"`);
      } catch (error: any) {
        toast.error('Erreur lors du déplacement de la tâche');
        console.error(error);
      }
      return;
    }

    // Si on dépose sur une autre tâche
    const overTask = tasks.find((t) => t._id === overId);
    if (!overTask) return;

    if (activeTask._id === overTask._id) return;

    const sameColumn = activeTask.column === overTask.column;

    try {
      let newPosition = overTask.position;
      
      // Si on déplace dans la même colonne et qu'on est après la tâche cible, ajuster la position
      if (sameColumn) {
        const activeIndex = tasksByColumn[activeTask.column as keyof typeof tasksByColumn].findIndex(
          (t) => t._id === activeId
        );
        const overIndex = tasksByColumn[overTask.column as keyof typeof tasksByColumn].findIndex(
          (t) => t._id === overId
        );
        
        if (activeIndex < overIndex) {
          newPosition = overTask.position;
        } else {
          newPosition = overTask.position + 1;
        }
      }

      const response = await axios.put(`/tasks/${activeId}/move`, {
        column: overTask.column,
        position: newPosition,
      });

      onTaskUpdate(response.data);
      
      if (!sameColumn) {
        toast.success(`Tâche déplacée vers "${columns.find(c => c.id === overTask.column)?.title}"`);
      }
    } catch (error: any) {
      toast.error('Erreur lors du déplacement de la tâche');
      console.error(error);
    }
  };

  const activeTask = activeId ? tasks.find((t) => t._id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            icon={column.icon}
            tasks={tasksByColumn[column.id as keyof typeof tasksByColumn]}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90">
            <TaskCard task={activeTask} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
