import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { Calendar, Users, AlertCircle } from 'lucide-react';
import { Task } from '../types';
import clsx from 'clsx';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.column !== 'done';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={clsx(
        'task-card cursor-pointer',
        isDragging && 'opacity-60 rotate-2 scale-105 shadow-2xl z-50'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 dark:text-white flex-1">
          {task.title}
        </h4>
        <span
          className={clsx(
            'text-xs font-medium px-2 py-1 rounded-full',
            priorityColors[task.priority as keyof typeof priorityColors]
          )}
        >
          {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-3">
          {task.dueDate && (
            <div className={clsx('flex items-center space-x-1', isOverdue && 'text-red-600')}>
              <Calendar className="w-3 h-3" />
              <span>
                {format(new Date(task.dueDate), 'dd MMM')}
              </span>
            </div>
          )}
          {task.assignedTo && task.assignedTo.length > 0 && (
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{task.assignedTo.length}</span>
            </div>
          )}
        </div>
        {task.comments && task.comments.length > 0 && (
          <span className="text-xs">{task.comments.length} commentaire(s)</span>
        )}
      </div>

      {isOverdue && (
        <div className="mt-2 flex items-center space-x-1 text-red-600 text-xs">
          <AlertCircle className="w-3 h-3" />
          <span>En retard</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
