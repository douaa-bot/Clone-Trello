import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MoreVertical, Trash2, Edit, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: {
    _id: string;
    name: string;
    description: string;
    color: string;
    owner: {
      _id: string;
      name: string;
    };
    members: Array<{
      user: {
        _id: string;
        name: string;
      };
    }>;
    createdAt: string;
  };
  onUpdate: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onUpdate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const isOwner = project.owner._id === user?.id;

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      await axios.delete(`/projects/${project._id}`);
      toast.success('Projet supprimé');
      onUpdate();
    } catch (error: any) {
      toast.error('Erreur lors de la suppression');
    }
    setShowMenu(false);
  };

  return (
    <div
      className="card hover:shadow-lg transition-all duration-200 cursor-pointer group relative"
      onClick={() => navigate(`/project/${project._id}`)}
      style={{
        borderTop: `4px solid ${project.color}`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex-1">
          {project.name}
        </h3>
        {isOwner && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 min-w-[150px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {project.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>{project.members.length + 1} membre(s)</span>
        </div>
        <span>
          {format(new Date(project.createdAt), 'dd MMM yyyy')}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
