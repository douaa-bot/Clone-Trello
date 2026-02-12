import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Activity, User, MessageSquare, Move, Plus, Trash2, Edit } from 'lucide-react';

interface ActivityItem {
  _id: string;
  type: 'task-created' | 'task-updated' | 'task-moved' | 'task-deleted' | 'comment-added';
  user: {
    name: string;
    email: string;
  };
  taskTitle?: string;
  fromColumn?: string;
  toColumn?: string;
  message?: string;
  createdAt: string;
}

interface ActivityFeedProps {
  projectId: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ projectId }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
    // Rafraîchir toutes les 10 secondes
    const interval = setInterval(fetchActivities, 10000);
    return () => clearInterval(interval);
  }, [projectId]);

  const fetchActivities = async () => {
    try {
      // Pour l'instant, on simule avec les tâches
      // Dans une vraie app, vous auriez une route dédiée pour l'historique
      const response = await axios.get(`/tasks/project/${projectId}`);
      // Transformer les données en activités (simulation)
      // Dans une vraie app, vous stockeriez les activités dans la DB
      setActivities([]);
    } catch (error) {
      console.error('Erreur lors du chargement des activités');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task-created':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'task-updated':
        return <Edit className="w-4 h-4 text-blue-500" />;
      case 'task-moved':
        return <Move className="w-4 h-4 text-purple-500" />;
      case 'task-deleted':
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'comment-added':
        return <MessageSquare className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityMessage = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'task-created':
        return `${activity.user.name} a créé la tâche "${activity.taskTitle}"`;
      case 'task-updated':
        return `${activity.user.name} a modifié la tâche "${activity.taskTitle}"`;
      case 'task-moved':
        return `${activity.user.name} a déplacé "${activity.taskTitle}" de ${activity.fromColumn} vers ${activity.toColumn}`;
      case 'task-deleted':
        return `${activity.user.name} a supprimé la tâche "${activity.taskTitle}"`;
      case 'comment-added':
        return `${activity.user.name} a commenté sur "${activity.taskTitle}"`;
      default:
        return activity.message || 'Activité inconnue';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Fil d'Activité</h3>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucune activité récente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  {getActivityMessage(activity)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {format(new Date(activity.createdAt), 'dd MMM yyyy à HH:mm')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
