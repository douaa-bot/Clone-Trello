import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Search, UserPlus, Trash2 } from 'lucide-react';

interface AddMemberModalProps {
  projectId: string;
  currentMembers: Array<{
    user: {
      _id: string;
      name: string;
      email: string;
    };
    role: string;
  }>;
  onClose: () => void;
  onSuccess: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  projectId,
  currentMembers,
  onClose,
  onSuccess,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleSearch = async () => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/users/search?q=${searchQuery}`);
      // Filtrer les membres déjà ajoutés
      const memberIds = currentMembers.map((m) => m.user._id);
      setSearchResults(
        response.data.filter((user: any) => !memberIds.includes(user.id))
      );
    } catch (error: any) {
      toast.error('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleAddMember = async (email: string) => {
    setAdding(true);
    try {
      await axios.post(`/projects/${projectId}/members`, { email });
      toast.success('Membre ajouté avec succès');
      setSearchQuery('');
      setSearchResults([]);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Retirer ce membre du projet ?')) return;

    try {
      await axios.delete(`/projects/${projectId}/members/${memberId}`);
      toast.success('Membre retiré');
      onSuccess();
    } catch (error: any) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Membres du Projet
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rechercher un membre
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
                placeholder="Nom ou email..."
              />
            </div>

            {loading && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Recherche...
              </p>
            )}

            {searchResults.length > 0 && (
              <div className="mt-3 space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddMember(user.email)}
                      disabled={adding}
                      className="btn-primary flex items-center space-x-1"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Ajouter</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Membres actuels ({currentMembers.length + 1})
            </h3>
            <div className="space-y-2">
              {currentMembers.map((member) => (
                <div
                  key={member.user._id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {member.user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {member.user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member.user._id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
