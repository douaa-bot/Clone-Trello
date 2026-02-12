import { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Task } from '../types';

interface AdvancedSearchProps {
  tasks: Task[];
  onSearchResults: (results: Task[]) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ tasks, onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priority: '',
    column: '',
    assignedTo: '',
    hasDueDate: false,
    overdue: false,
  });

  const handleSearch = () => {
    let results = [...tasks];

    // Recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }

    // Filtres
    if (filters.priority) {
      results = results.filter((task) => task.priority === filters.priority);
    }

    if (filters.column) {
      results = results.filter((task) => task.column === filters.column);
    }

    if (filters.assignedTo) {
      results = results.filter((task) =>
        task.assignedTo?.some(
          (assignee: any) => (assignee._id || assignee) === filters.assignedTo
        )
      );
    }

    if (filters.hasDueDate) {
      results = results.filter((task) => task.dueDate);
    }

    if (filters.overdue) {
      results = results.filter(
        (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.column !== 'done'
      );
    }

    onSearchResults(results);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      priority: '',
      column: '',
      assignedTo: '',
      hasDueDate: false,
      overdue: false,
    });
    onSearchResults(tasks);
  };

  return (
    <div className="card mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Rechercher une tâche..."
            className="input pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                handleSearch();
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center space-x-2 ${
            showFilters ? 'bg-primary-100 dark:bg-primary-900' : ''
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filtres</span>
        </button>

        <button onClick={handleSearch} className="btn-primary">
          Rechercher
        </button>

        {(searchQuery || Object.values(filters).some((v) => v)) && (
          <button onClick={clearFilters} className="btn-secondary">
            Réinitialiser
          </button>
        )}
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priorité
            </label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="input"
            >
              <option value="">Toutes</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Colonne
            </label>
            <select
              value={filters.column}
              onChange={(e) => setFilters({ ...filters, column: e.target.value })}
              className="input"
            >
              <option value="">Toutes</option>
              <option value="todo">À Faire</option>
              <option value="doing">En Cours</option>
              <option value="done">Terminé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.hasDueDate}
                  onChange={(e) => setFilters({ ...filters, hasDueDate: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Avec date limite</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.overdue}
                  onChange={(e) => setFilters({ ...filters, overdue: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">En retard</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
