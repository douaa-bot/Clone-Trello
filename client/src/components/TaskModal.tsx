import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X, Calendar, Users, MessageSquare } from 'lucide-react';
import { Task } from '../types';
import { format } from 'date-fns';

interface TaskModalProps {
  task: Task | null;
  projectId: string;
  projectMembers: Array<{
    user: {
      _id: string;
      name: string;
      email: string;
    };
  }>;
  onClose: () => void;
  onSuccess: (task: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  projectId,
  projectMembers,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [column, setColumn] = useState<'todo' | 'doing' | 'done'>('todo');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setColumn(task.column);
      setPriority(task.priority);
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
      setAssignedTo(task.assignedTo?.map((u: any) => u._id || u) || []);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Le titre est requis');
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        title,
        description,
        project: projectId,
        column,
        priority,
        dueDate: dueDate?.toISOString(),
        assignedTo,
      };

      let response;
      if (task) {
        response = await axios.put(`/tasks/${task._id}`, taskData);
      } else {
        response = await axios.post('/tasks', taskData);
      }

      toast.success(task ? 'Tâche mise à jour' : 'Tâche créée');
      onSuccess(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !task) return;

    // Détecter les mentions @username
    const mentionRegex = /@(\w+)/g;
    const mentions = commentText.match(mentionRegex);
    
    if (mentions) {
      mentions.forEach((mention) => {
        const username = mention.replace('@', '');
        const member = projectMembers.find(
          (m) => m.user.name.toLowerCase() === username.toLowerCase()
        );
        if (member) {
          toast.success(`Mentionné ${member.user.name} dans le commentaire`);
        }
      });
    }

    try {
      const response = await axios.post(`/tasks/${task._id}/comments`, {
        text: commentText,
      });
      toast.success('Commentaire ajouté');
      setCommentText('');
      onSuccess(response.data);
    } catch (error: any) {
      toast.error('Erreur lors de l\'ajout du commentaire');
    }
  };

  const toggleAssignee = (userId: string) => {
    setAssignedTo((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {task ? 'Modifier la tâche' : 'Nouvelle Tâche'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titre *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="Titre de la tâche"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input min-h-[100px] resize-none"
              placeholder="Description de la tâche..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Colonne
              </label>
              <select
                value={column}
                onChange={(e) => setColumn(e.target.value as any)}
                className="input"
              >
                <option value="todo">À Faire</option>
                <option value="doing">En Cours</option>
                <option value="done">Terminé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priorité
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="input"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date limite
            </label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              dateFormat="dd/MM/yyyy"
              className="input"
              placeholderText="Sélectionner une date"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assigner à
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {projectMembers.map((member) => {
                const isSelected = assignedTo.includes(member.user._id);
                return (
                  <label
                    key={member.user._id}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleAssignee(member.user._id)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {member.user.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {task && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Commentaires
              </label>
              <div className="space-y-3 mb-3 max-h-60 overflow-y-auto">
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map((comment: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.user?.name || 'Utilisateur'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {comment.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Aucun commentaire
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span>💡 Astuce : Utilisez @nom pour mentionner un membre</span>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="input flex-1"
                    placeholder="Ajouter un commentaire... (utilisez @nom pour mentionner)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddComment}
                    className="btn-primary"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
                {/* Suggestions de mentions */}
                {commentText.includes('@') && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 space-y-1 max-h-32 overflow-y-auto">
                    {projectMembers
                      .filter((m) =>
                        m.user.name.toLowerCase().includes(
                          commentText.split('@')[1]?.toLowerCase() || ''
                        )
                      )
                      .map((member) => (
                        <button
                          key={member.user._id}
                          type="button"
                          onClick={() => {
                            const beforeAt = commentText.split('@')[0];
                            setCommentText(`${beforeAt}@${member.user.name} `);
                          }}
                          className="w-full text-left px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm"
                        >
                          @{member.user.name}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Enregistrement...' : task ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
