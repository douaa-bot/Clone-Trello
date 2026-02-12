import { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp, Clock, CheckCircle2, AlertCircle, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  overdueTasks: number;
  tasksByPriority: {
    high: number;
    medium: number;
    low: number;
  };
  tasksByMember: Array<{
    memberId: string;
    memberName: string;
    taskCount: number;
  }>;
  completionRate: number;
  averageCompletionTime: number;
}

interface AnalyticsDashboardProps {
  projectId: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ projectId }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [projectId]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`/tasks/project/${projectId}`);
      const tasks = response.data;

      // Calculer les statistiques
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t: any) => t.column === 'done').length;
      const inProgressTasks = tasks.filter((t: any) => t.column === 'doing').length;
      const todoTasks = tasks.filter((t: any) => t.column === 'todo').length;
      const overdueTasks = tasks.filter(
        (t: any) => t.dueDate && new Date(t.dueDate) < new Date() && t.column !== 'done'
      ).length;

      const tasksByPriority = {
        high: tasks.filter((t: any) => t.priority === 'high').length,
        medium: tasks.filter((t: any) => t.priority === 'medium').length,
        low: tasks.filter((t: any) => t.priority === 'low').length,
      };

      // Calculer les tâches par membre
      const memberTasks: Record<string, { name: string; count: number }> = {};
      tasks.forEach((task: any) => {
        if (task.assignedTo && task.assignedTo.length > 0) {
          task.assignedTo.forEach((member: any) => {
            const memberId = member._id || member;
            const memberName = member.name || 'Non assigné';
            if (!memberTasks[memberId]) {
              memberTasks[memberId] = { name: memberName, count: 0 };
            }
            memberTasks[memberId].count++;
          });
        }
      });

      const tasksByMember = Object.entries(memberTasks).map(([memberId, data]) => ({
        memberId,
        memberName: data.name,
        taskCount: data.count,
      }));

      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      setAnalytics({
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        overdueTasks,
        tasksByPriority,
        tasksByMember,
        completionRate,
        averageCompletionTime: 0, // À calculer si nécessaire
      });
    } catch (error) {
      console.error('Erreur lors du chargement des analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Tâches</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {analytics.totalTasks}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Terminées</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {analytics.completedTasks}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">En Cours</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {analytics.inProgressTasks}
              </p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">En Retard</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {analytics.overdueTasks}
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Taux de complétion */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Taux de Complétion
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Progression</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {analytics.completionRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.completionRate}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.todoTasks}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">À Faire</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.inProgressTasks}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">En Cours</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.completedTasks}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Terminé</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tâches par Priorité */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Répartition par Priorité
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  Haute
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {analytics.tasksByPriority.high}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      analytics.totalTasks > 0
                        ? (analytics.tasksByPriority.high / analytics.totalTasks) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  Moyenne
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {analytics.tasksByPriority.medium}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      analytics.totalTasks > 0
                        ? (analytics.tasksByPriority.medium / analytics.totalTasks) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Basse
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {analytics.tasksByPriority.low}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      analytics.totalTasks > 0
                        ? (analytics.tasksByPriority.low / analytics.totalTasks) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tâches par Membre */}
      {analytics.tasksByMember.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Répartition par Membre
          </h3>
          <div className="space-y-3">
            {analytics.tasksByMember.map((member) => (
              <div key={member.memberId} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{member.memberName}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          analytics.totalTasks > 0
                            ? (member.taskCount / analytics.totalTasks) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white w-8 text-right">
                    {member.taskCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
