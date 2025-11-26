import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Search, RefreshCw, Home } from 'lucide-react';
import Swal from 'sweetalert2';

import { PrestationTypeDTO } from './models';
import { PrestationService } from './prestation.service';
import { AddPrestationModal } from './components/add-prestation-modal';

const AccountBasicContent = () => {
  const [prestations, setPrestations] = useState<PrestationTypeDTO[]>([]);
  const [filteredPrestations, setFilteredPrestations] = useState<PrestationTypeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PrestationTypeDTO | null>(null);

  // Charger les données
  const fetchPrestations = async () => {
    setLoading(true);
    try {
      const data = await PrestationService.getAll();
      const list = Array.isArray(data) ? data : [];
      setPrestations(list);
      setFilteredPrestations(list);
    } catch (error) {
      console.error("Erreur API:", error);
      // En cas d'erreur, on laisse la liste vide pour l'instant
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestations();
  }, []);

  // Filtrer la recherche
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredPrestations(prestations);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = prestations.filter(item => 
        item.code.toLowerCase().includes(lowerTerm) || 
        item.description.toLowerCase().includes(lowerTerm)
      );
      setFilteredPrestations(filtered);
    }
  }, [searchTerm, prestations]);

  const handleCreateOrUpdate = async (data: PrestationTypeDTO) => {
    try {
      if (editingItem && editingItem.id) {
        await PrestationService.update(editingItem.id, data);
        Swal.fire({ icon: 'success', title: 'Succès', text: 'Mis à jour avec succès', timer: 1500, showConfirmButton: false });
      } else {
        await PrestationService.create(data);
        Swal.fire({ icon: 'success', title: 'Succès', text: 'Créé avec succès', timer: 1500, showConfirmButton: false });
      }
      setIsModalOpen(false);
      fetchPrestations();
    } catch (error) {
      console.error(error);
      Swal.fire('Erreur', "Une erreur est survenue.", 'error');
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Impossible de revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await PrestationService.delete(id);
        Swal.fire('Supprimé!', 'L\'élément a été supprimé.', 'success');
        fetchPrestations();
      } catch (error) {
        Swal.fire('Erreur', 'Impossible de supprimer.', 'error');
      }
    }
  };

  const openModal = (item?: PrestationTypeDTO) => {
    setEditingItem(item || null);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      
      {/* En-tête avec Titre et Icône */}
      <div className="flex items-center gap-2 mb-2">
        <Home className="text-gray-400" size={20} />
        <h1 className="text-lg font-bold text-gray-900">Gestion des Prestations</h1>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        Créez, recherchez et gérez les types de prestations. Accès réservé aux administrateurs.
      </p>

      {/* Barre d'actions (Recherche + Boutons) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        {/* Barre de recherche */}
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Rechercher par code ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Boutons */}
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={() => fetchPrestations()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors w-full sm:w-auto"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Actualiser
          </button>
          <button 
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg font-medium transition-colors w-full sm:w-auto"
          >
            <Plus size={18} />
            Ajouter
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto border border-gray-100 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Code</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-full">Description</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={3} className="py-10 text-center">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <Loader2 className="animate-spin" /> Chargement...
                  </div>
                </td>
              </tr>
            ) : filteredPrestations.length > 0 ? (
              filteredPrestations.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-bold text-gray-900">
                    {item.code}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {item.description}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openModal(item)}
                        className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all"
                        title="Modifier"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => item.id && handleDelete(item.id)}
                        className="p-2 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-12 text-center text-gray-400">
                  <Search size={40} className="mx-auto mb-3 opacity-20" />
                  <p>Aucun résultat trouvé</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddPrestationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateOrUpdate}
        initialData={editingItem}
      />
    </div>
  );
};

export { AccountBasicContent };