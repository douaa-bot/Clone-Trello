import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Task } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface FocusModeProps {
  tasks: Task[];
  onFilterChange: (filteredTasks: Task[]) => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ tasks, onFilterChange }) => {
  const [isActive, setIsActive] = useState(false);
  const { user } = useAuth();

  const toggleFocusMode = () => {
    if (!isActive) {
      // Filtrer les tâches assignées à l'utilisateur
      const myTasks = tasks.filter((task) => {
        if (!task.assignedTo || task.assignedTo.length === 0) return false;
        return task.assignedTo.some(
          (assignee: any) => (assignee._id || assignee) === user?.id
        );
      });
      onFilterChange(myTasks);
      setIsActive(true);
    } else {
      // Réinitialiser : afficher toutes les tâches
      onFilterChange(tasks);
      setIsActive(false);
    }
  };

  if (!isActive) {
    return (
      <button
        onClick={toggleFocusMode}
        className="btn-secondary flex items-center space-x-2"
        title="Mode Focus : Afficher uniquement mes tâches"
      >
        <Filter className="w-4 h-4" />
        <span>Mode Focus</span>
      </button>
    );
  }

  const myTasksCount = tasks.filter((task) => {
    if (!task.assignedTo || task.assignedTo.length === 0) return false;
    return task.assignedTo.some((assignee: any) => (assignee._id || assignee) === user?.id);
  }).length;

  return (
    <div className="flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 px-4 py-2 rounded-lg border border-primary-300 dark:border-primary-700">
      <Filter className="w-4 h-4 text-primary-600 dark:text-primary-400" />
      <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
        Mode Focus actif ({myTasksCount} tâche{myTasksCount > 1 ? 's' : ''})
      </span>
      <button
        onClick={toggleFocusMode}
        className="ml-2 p-1 hover:bg-primary-200 dark:hover:bg-primary-800 rounded transition-colors"
        title="Désactiver le mode Focus"
      >
        <X className="w-4 h-4 text-primary-600 dark:text-primary-400" />
      </button>
    </div>
  );
};

export default FocusMode;
