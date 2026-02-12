import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, Plus, Moon, Sun, LogOut, Users, BarChart3, Activity } from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../components/TaskModal';
import AddMemberModal from '../components/AddMemberModal';
import NotificationBell from '../components/NotificationBell';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import FocusMode from '../components/FocusMode';
import AdvancedSearch from '../components/AdvancedSearch';
import ActivityFeed from '../components/ActivityFeed';

interface Project {
  _id: string;
  name: string;
  description: string;
  color: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  members: Array<{
    user: {
      _id: string;
      name: string;
      email: string;
    };
    role: string;
  }>;
}

const ProjectBoard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showActivityFeed, setShowActivityFeed] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProject();
      fetchTasks();
      connectSocket();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [id]);

  const connectSocket = () => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connecté');
      if (id) {
        newSocket.emit('join-project', id);
      }
    });

    newSocket.on('task-updated', (data) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === data.task._id ? data.task : task))
      );
    });

    newSocket.on('task-created', (data) => {
      setTasks((prev) => [...prev, data.task]);
    });

    newSocket.on('task-deleted', (data) => {
      setTasks((prev) => prev.filter((task) => task._id !== data.taskId));
    });

    setSocket(newSocket);
  };

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/projects/${id}`);
      setProject(response.data);
    } catch (error: any) {
      toast.error('Erreur lors du chargement du projet');
      navigate('/dashboard');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`/tasks/project/${id}`);
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results: any[]) => {
    setFilteredTasks(results);
    setIsFiltered(true);
  };

  const handleFocusFilter = (results: any[]) => {
    setFilteredTasks(results);
    setIsFiltered(results.length !== tasks.length);
  };

  // Vérifier les deadlines proches
  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      tasks.forEach((task) => {
        if (task.dueDate && task.column !== 'done') {
          const dueDate = new Date(task.dueDate);
          if (dueDate <= tomorrow && dueDate >= now) {
            toast.error(`⚠️ La tâche "${task.title}" arrive à échéance bientôt !`, {
              duration: 5000,
              icon: '⏰',
            });
          } else if (dueDate < now) {
            toast.error(`🚨 La tâche "${task.title}" est en retard !`, {
              duration: 5000,
              icon: '⚠️',
            });
          }
        }
      });
    };

    if (tasks.length > 0) {
      checkDeadlines();
      // Vérifier toutes les heures
      const interval = setInterval(checkDeadlines, 3600000);
      return () => clearInterval(interval);
    }
  }, [tasks]);

  const handleCreateTask = () => {
    setSelectedTask(null);
    setShowTaskModal(true);
  };

  const handleTaskCreated = (newTask: any) => {
    setTasks((prev) => [...prev, newTask]);
    setShowTaskModal(false);
  };

  const handleTaskUpdated = (updatedTask: any) => {
    setTasks((prev) =>
      prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
    setShowTaskModal(false);
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const isOwner = project?.owner._id === user?.id;
  const isAdmin = isOwner || project?.members.some(
    (m) => m.user._id === user?.id && m.role === 'admin'
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700"
        style={{
          backgroundColor: project?.color || '#6366f1',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {project?.name}
                </h1>
                {project?.description && (
                  <p className="text-sm text-white/80">{project.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMemberModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="hidden sm:inline">
                  {project?.members.length + 1} membre(s)
                </span>
              </button>

              <NotificationBell />

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-white" />
                )}
              </button>

              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Onglets */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setShowAnalytics(false);
                setShowActivityFeed(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !showAnalytics && !showActivityFeed
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Tableau Kanban
            </button>
            <button
              onClick={() => {
                setShowAnalytics(true);
                setShowActivityFeed(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                showAnalytics
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytiques</span>
            </button>
            <button
              onClick={() => {
                setShowAnalytics(false);
                setShowActivityFeed(true);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                showActivityFeed
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Activité</span>
            </button>
          </div>
          {isAdmin && !showAnalytics && !showActivityFeed && (
            <button onClick={handleCreateTask} className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Nouvelle Tâche</span>
            </button>
          )}
        </div>

        {showAnalytics ? (
          <AnalyticsDashboard projectId={id!} />
        ) : showActivityFeed ? (
          <ActivityFeed projectId={id!} />
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              <AdvancedSearch
                tasks={tasks}
                onSearchResults={handleSearchResults}
              />
              <FocusMode tasks={tasks} onFilterChange={handleFocusFilter} />
            </div>

            <KanbanBoard
              tasks={isFiltered ? filteredTasks : tasks}
              projectId={id!}
              onTaskClick={handleTaskClick}
              onTaskUpdate={handleTaskUpdated}
            />
          </>
        )}
      </main>

      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          projectId={id!}
          projectMembers={project?.members || []}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          onSuccess={selectedTask ? handleTaskUpdated : handleTaskCreated}
        />
      )}

      {showMemberModal && (
        <AddMemberModal
          projectId={id!}
          currentMembers={project?.members || []}
          onClose={() => setShowMemberModal(false)}
          onSuccess={fetchProject}
        />
      )}
    </div>
  );
};

export default ProjectBoard;
