// components/AdminPlateformeConfig.tsx
"use client";

import { usePlateformeManagement } from "@/hooks/usePlateforme";
import { PlateformeConfig } from "@/types/plateforme";
import { useState } from "react";
import PlateformeInputModal from "./plateformeInputModal";
import { useCurrentUtilisateur } from "@/hooks/useUtilisateurs";
import { 
  Settings, 
  Power, 
  PowerOff, 
  Edit3, 
  Trash2, 
  Plus,
  Users,
  Eye,
  EyeOff
} from "lucide-react";

export default function AdminPlateformeConfig() {
  const {
    plateformes,
    isLoading,
    deletePlateforme,
    connecter,
    deconnecter,
    isConnecting,
    nombreConnexions,
    addPlateforme,
    updatePlateforme,
  } = usePlateformeManagement();

  const { utilisateur, isAdmin, isLoading: isUserLoading } = useCurrentUtilisateur();
  const [selectedPlateforme, setSelectedPlateforme] = useState<PlateformeConfig | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'config' | 'connexions'>('config');


  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Accès réservé aux administrateurs</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  if (isLoading || isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la configuration...</p>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    setSelectedPlateforme(null);
    setShowModal(true);
  };

  const handleEdit = (plateforme: PlateformeConfig) => {
    setSelectedPlateforme(plateforme);
    setShowModal(true);
  };

  const handleDelete = async (id: number, nom: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la plateforme "${nom}" ?`)) {
      try {
        await deletePlateforme(id);
        // Optionnel: Ajouter un toast de succès
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        // Optionnel: Ajouter un toast d'erreur
      }
    }
  };

  const handleToggleActive = async (plateforme: PlateformeConfig) => {
    try {
      await updatePlateforme({
        id: plateforme.id,
        active: !plateforme.active,
        nom: plateforme.nom,
        config: plateforme.config
      });
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
    }
  };

  const handleConnect = (plateformeNom: string) => {
    connecter(plateformeNom);
  };

  const handleDisconnect = (plateformeNom: string) => {
    if (confirm(`Voulez-vous vraiment vous déconnecter de ${plateformeNom} ?`)) {
      deconnecter(plateformeNom);
    }
  };

  // Statistiques pour l'admin
  const stats = {
    total: plateformes.length,
    actives: plateformes.filter(p => p.active).length,
    inactives: plateformes.filter(p => !p.active).length,
    connectees: plateformes.filter(p => p.estConnecte).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête avec statistiques */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Configuration des Plateformes
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez les plateformes disponibles pour les utilisateurs
              </p>
            </div>
            
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouvelle Plateforme
            </button>
          </div>

          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Power className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.actives}</p>
                  <p className="text-sm text-gray-500">Actives</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <PowerOff className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.inactives}</p>
                  <p className="text-sm text-gray-500">Inactives</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{stats.connectees}</p>
                  <p className="text-sm text-gray-500">Connectées</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des plateformes */}
        {plateformes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune plateforme configurée</h3>
            <p className="text-gray-600 mb-4">
              Commencez par ajouter votre première plateforme.
            </p>
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              Ajouter une plateforme
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plateforme
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Connexion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plateformes.map((plateforme) => (
                  <tr key={plateforme.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">🔗</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {plateforme.nom}
                          </div>
                          {/* <div className="text-sm text-gray-500">
                            ID: {plateforme.id}
                          </div> */}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(plateforme)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          plateforme.active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {plateforme.active ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {plateforme.estConnecte ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Power className="w-3 h-3 mr-1" />
                          Connecté
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Non connecté
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {plateforme.date_creation 
                        ? new Date(plateforme.date_creation).toLocaleDateString('fr-FR')
                        : 'N/A'
                      }
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        {/* Test de connexion (admin peut se connecter pour tester) */}
                        {plateforme.active && (
                          plateforme.estConnecte ? (
                            <button
                              onClick={() => handleDisconnect(plateforme.nom)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Se déconnecter"
                            >
                              <PowerOff className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleConnect(plateforme.nom)}
                              disabled={isConnecting}
                              className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                              title="Se connecter"
                            >
                              <Power className="w-4 h-4" />
                            </button>
                          )
                        )}
                        
                        <button
                          onClick={() => handleEdit(plateforme)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Modifier"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(plateforme.id, plateforme.nom)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal d'édition/création */}
        {showModal && (
          <PlateformeInputModal
            onClose={() => {
              setShowModal(false);
              setSelectedPlateforme(null);
            }}
            plateforme={selectedPlateforme}
            onSuccess={() => {
              setShowModal(false);
              setSelectedPlateforme(null);
            }}
          />
        )}
      </div>
    </div>
  );
}


// 'use client'

// import { useModelIA } from "@/hooks/useModelIA";
// import { ModelIA } from "@/types/modelIA";
// import { useState } from "react";
// import ModelIAInputModal from "./modelIAInputModal";
// import { useCurrentUtilisateur } from "@/hooks/useUtilisateurs";
// import { Settings, Edit3, Trash2, Plus } from "lucide-react";

// export default function AdminModelIATable() {
//   const { modelIA, isPending, deleteModelIA } = useModelIA();
//   const [selectedModelIA, setSelectedModelIA] = useState<ModelIA | null>(null);
//   const [showModal, setShowModal] = useState(false);

//   // 🔒 Hook utilisateur
//   const { utilisateur, isAdmin, isLoading: isUserLoading } = useCurrentUtilisateur();

//   if (isUserLoading || isPending) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-xl font-semibold">Chargement...</div>
//       </div>
//     );
//   }

//   // 🔒 Bloquer l'accès si pas admin
//   if (!isAdmin) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Settings className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold mb-2">Accès réservé aux administrateurs</h2>
//           <p className="text-gray-600">
//             Vous n'avez pas les permissions nécessaires pour accéder à cette page.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const handleAdd = () => {
//     setSelectedModelIA(null);
//     setShowModal(true);
//   };

//   const handleEdit = (model: ModelIA) => {
//     setSelectedModelIA(model);
//     setShowModal(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (confirm("Voulez-vous vraiment supprimer ce modèle ?")) {
//       deleteModelIA(id);
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedModelIA(null);
//   };

//   return (
//     <div className="p-4 bg-gray-100 min-h-screen">
//       <div className="container mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">Gestion des Modèles IA</h1>
//           {isAdmin && (
//             <button
//               onClick={handleAdd}
//               className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
//             >
//               <Plus className="w-5 h-5" />
//               Ajouter un modèle
//             </button>
//           )}
//         </div>

//         {modelIA.length === 0 ? (
//           <div className="text-center text-gray-500 text-lg mt-12">
//             Aucun modèle trouvé. Ajoutez-en un pour commencer !
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {modelIA.map((m) => (
//               <div
//                 key={m.id}
//                 className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
//               >
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900 mb-2">{m.nom_model}</h2>
//                   <p className="text-gray-600 mb-2">Type: {m.type_model}</p>
//                   <p className="text-gray-600 mb-2">Fournisseur: {m.fournisseur}</p>
//                   <p className="text-gray-600 mb-4 line-clamp-4">URL: {m.api_endpoint}</p>
//                   <p className="text-gray-500 mb-4">
//                     Configuration:{" "}
//                     {m.parametres_default
//                       ? JSON.stringify(m.parametres_default, null, 2)
//                       : "Pas de paramètres"}
//                   </p>
//                 </div>
//                 <div className="flex items-center text-sm text-gray-500 mb-4">
//                   Cout/token: {m.cout_par_token}
//                 </div>
//                 {isAdmin && (
//                   <div className="flex justify-end space-x-2">
//                     <button
//                       onClick={() => handleEdit(m)}
//                       className="text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1"
//                     >
//                       <Edit3 className="w-4 h-4" /> Modifier
//                     </button>
//                     <button
//                       onClick={() => handleDelete(m.id)}
//                       className="text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
//                     >
//                       <Trash2 className="w-4 h-4" /> Supprimer
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       {showModal && (
//         <ModelIAInputModal
//           onClose={handleCloseModal}
//           modelIA={selectedModelIA}
//         />
//       )}
//     </div>
//   );
// }
