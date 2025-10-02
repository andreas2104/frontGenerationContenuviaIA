// 'use client';
// import { useState } from 'react';
// import { usePublications, usePublicationStats, usePublicationsAttention } from '@/hooks/usePublication';
// import { useContenu } from '@/hooks/useContenu';
// import { useUtilisateurPlateforme } from '@/hooks/useUtilisateurPlateforme';
// import { useCurrentUtilisateur } from '@/hooks/useUtilisateurs';
// // import { StatutPublicationEnum } from '@/types/publication';
// import { TailSpin } from 'react-loader-spinner';
// import { 
//   Calendar, 
//   AlertTriangle, 
//   CheckCircle, 
//   Clock, 
//   Edit3, 
//   Trash2, 
//   Play,
//   X,
//   BarChart3,
//   Filter
// } from 'lucide-react';
// import { StatutPublicationEnum } from '@/types/publication';

// export default function GestionPublicationsPage() {
//   const {
//     publications,
//     publicationsFiltrees,
//     statistiques,
//     prochainesPublications,
//     actions,
//     etatsChargement,
//     isLoading,
//     error
//   } = usePublications();

//   const { stats } = usePublicationStats();
//   const { publicationsAttention } = usePublicationsAttention();
//   const { contenus } = useContenu();
//   const { plateformesDisponibles } = useUtilisateurPlateforme();
//   const { utilisateur, isAdmin } = useCurrentUtilisateur();

//   const [filtreStatut, setFiltreStatut] = useState<string>('toutes');
//   const [publicationSelectionnee, setPublicationSelectionnee] = useState<any>(null);
//   const [showModal, setShowModal] = useState(false);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <TailSpin height="50" width="50" color="#4a90e2" ariaLabel="Chargement..." />
//         <div className="text-xl font-semibold text-gray-700 ml-4">Chargement des publications...</div>
//       </div>
//     );
//   }

//   if (!utilisateur) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <div className="text-xl text-red-600">
//           Utilisateur non connecté
//           <div className="mt-4">
//             <button
//               onClick={() => (window.location.href = "/login")}
//               className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
//             >
//               Aller à la connexion
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Filtrer les publications selon le statut sélectionné
//   const publicationsFiltreesAffichage = filtreStatut === 'toutes' 
//     ? publications 
//     : publicationsFiltrees[filtreStatut as keyof typeof publicationsFiltrees] || [];

//   const getStatutColor = (statut: StatutPublicationEnum) => {
//     const colors = {
//       [StatutPublicationEnum.brouillon]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       [StatutPublicationEnum.programme]: 'bg-blue-100 text-blue-800 border-blue-200',
//       [StatutPublicationEnum.publie]: 'bg-green-100 text-green-800 border-green-200',
//       [StatutPublicationEnum.erreur]: 'bg-red-100 text-red-800 border-red-200',
//       [StatutPublicationEnum.annule]: 'bg-gray-100 text-gray-800 border-gray-200',
//     };
//     return colors[statut] || colors[StatutPublicationEnum.brouillon];
//   };

//   const getStatutIcon = (statut: StatutPublicationEnum) => {
//     const icons = {
//       [StatutPublicationEnum.brouillon]: <Edit3 className="w-4 h-4" />,
//       [StatutPublicationEnum.programme]: <Clock className="w-4 h-4" />,
//       [StatutPublicationEnum.publie]: <CheckCircle className="w-4 h-4" />,
//       [StatutPublicationEnum.erreur]: <AlertTriangle className="w-4 h-4" />,
//       [StatutPublicationEnum.annule]: <X className="w-4 h-4" />,
//     };
//     return icons[statut];
//   };

//   const handlePublier = async (publicationId: number) => {
//     try {
//       await actions.publier(publicationId);
//       // Toast de succès
//     } catch (error) {
//       console.error('Erreur publication:', error);
//     }
//   };

//   const handleProgrammer = async (publicationId: number, date: string) => {
//     try {
//       await actions.programmer(publicationId, date);
//       setShowModal(false);
//     } catch (error) {
//       console.error('Erreur programmation:', error);
//     }
//   };

//   const handleSupprimer = async (publicationId: number) => {
//     if (confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
//       try {
//         await actions.supprimer(publicationId);
//       } catch (error) {
//         console.error('Erreur suppression:', error);
//       }
//     }
//   };

//   return (
//     <div className="p-4 bg-gray-100 min-h-screen">
//       <div className="mx-auto max-w-7xl">
        
//         {/* En-tête avec statistiques */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Gestion des Publications</h1>
//               <p className="text-gray-600 mt-2">Planifiez et gérez vos publications sur toutes vos plateformes</p>
//             </div>
//             <button
//               onClick={() => setShowModal(true)}
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
//             >
//               <Calendar className="w-5 h-5" />
//               Nouvelle Publication
//             </button>
//           </div>

//           {/* Cartes de statistiques */}
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
//             <StatCard 
//               title="Total" 
//               value={statistiques.total} 
//               icon={<BarChart3 className="w-6 h-6" />}
//               color="text-gray-600"
//             />
//             <StatCard 
//               title="Brouillons" 
//               value={statistiques.brouillons} 
//               icon={<Edit3 className="w-6 h-6" />}
//               color="text-yellow-600"
//             />
//             <StatCard 
//               title="Programmées" 
//               value={statistiques.programmees} 
//               icon={<Clock className="w-6 h-6" />}
//               color="text-blue-600"
//             />
//             <StatCard 
//               title="Publiées" 
//               value={statistiques.publiees} 
//               icon={<CheckCircle className="w-6 h-6" />}
//               color="text-green-600"
//             />
//             <StatCard 
//               title="En erreur" 
//               value={statistiques.enErreur} 
//               icon={<AlertTriangle className="w-6 h-6" />}
//               color="text-red-600"
//             />
//           </div>

//           {/* Alertes nécessitant attention */}
//           {(publicationsAttention.enErreur.length > 0 || 
//             publicationsAttention.brouillonsAnciens.length > 0 ||
//             publicationsAttention.programmationsImminentes.length > 0) && (
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
//               <div className="flex items-center gap-2 mb-2">
//                 <AlertTriangle className="w-5 h-5 text-yellow-600" />
//                 <h3 className="text-lg font-semibold text-yellow-800">Attention requise</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                 {publicationsAttention.enErreur.length > 0 && (
//                   <div className="flex items-center gap-2">
//                     <span className="w-2 h-2 bg-red-500 rounded-full"></span>
//                     <span className="text-yellow-700">
//                       {publicationsAttention.enErreur.length} publication(s) en erreur
//                     </span>
//                   </div>
//                 )}
//                 {publicationsAttention.brouillonsAnciens.length > 0 && (
//                   <div className="flex items-center gap-2">
//                     <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
//                     <span className="text-yellow-700">
//                       {publicationsAttention.brouillonsAnciens.length} brouillon(s) ancien(s)
//                     </span>
//                   </div>
//                 )}
//                 {publicationsAttention.programmationsImminentes.length > 0 && (
//                   <div className="flex items-center gap-2">
//                     <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                     <span className="text-yellow-700">
//                       {publicationsAttention.programmationsImminentes.length} publication(s) imminente(s)
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="grid lg:grid-cols-4 gap-6">
          
//           {/* Sidebar avec filtres et prochaines publications */}
//           <div className="lg:col-span-1 space-y-6">
            
//             {/* Filtres par statut */}
//             <div className="bg-white rounded-lg shadow-sm p-4">
//               <div className="flex items-center gap-2 mb-4">
//                 <Filter className="w-5 h-5 text-gray-600" />
//                 <h3 className="font-semibold text-gray-900">Filtrer par statut</h3>
//               </div>
//               <div className="space-y-2">
//                 {[
//                   { key: 'toutes', label: 'Toutes les publications', count: statistiques.total },
//                   { key: 'brouillons', label: 'Brouillons', count: statistiques.brouillons },
//                   { key: 'programmees', label: 'Programmées', count: statistiques.programmees },
//                   { key: 'publiees', label: 'Publiées', count: statistiques.publiees },
//                   { key: 'enErreur', label: 'En erreur', count: statistiques.enErreur },
//                 ].map((filtre) => (
//                   <button
//                     key={filtre.key}
//                     onClick={() => setFiltreStatut(filtre.key)}
//                     className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
//                       filtreStatut === filtre.key 
//                         ? 'bg-blue-100 text-blue-700 font-medium' 
//                         : 'text-gray-700 hover:bg-gray-100'
//                     }`}
//                   >
//                     <div className="flex justify-between items-center">
//                       <span>{filtre.label}</span>
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         filtreStatut === filtre.key 
//                           ? 'bg-blue-200 text-blue-800' 
//                           : 'bg-gray-200 text-gray-700'
//                       }`}>
//                         {filtre.count}
//                       </span>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Prochaines publications */}
//             {prochainesPublications.length > 0 && (
//               <div className="bg-white rounded-lg shadow-sm p-4">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Clock className="w-5 h-5 text-blue-600" />
//                   <h3 className="font-semibold text-gray-900">Prochaines publications</h3>
//                 </div>
//                 <div className="space-y-3">
//                   {prochainesPublications.slice(0, 5).map(publication => (
//                     <div key={publication.id} className="border border-gray-200 rounded-lg p-3">
//                       <div className="flex justify-between items-start mb-2">
//                         <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
//                           {publication.titre_publication}
//                         </h4>
//                         <button
//                           onClick={() => handlePublier(publication.id)}
//                           disabled={etatsChargement.isPublishing}
//                           className="text-green-600 hover:text-green-700 disabled:opacity-50"
//                           title="Publier maintenant"
//                         >
//                           <Play className="w-4 h-4" />
//                         </button>
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {new Date(publication.date_programmee!).toLocaleString('fr-FR', {
//                           day: 'numeric',
//                           month: 'short',
//                           hour: '2-digit',
//                           minute: '2-digit'
//                         })}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Liste principale des publications */}
//           <div className="lg:col-span-3">
//             <div className="bg-white rounded-lg shadow-sm">
              
//               {/* En-tête du tableau */}
//               <div className="px-6 py-4 border-b border-gray-200">
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-lg font-semibold text-gray-900">
//                     {filtreStatut === 'toutes' ? 'Toutes les publications' : 
//                      `Publications ${filtreStatut}`} 
//                     <span className="text-gray-500 ml-2">({publicationsFiltreesAffichage.length})</span>
//                   </h2>
//                 </div>
//               </div>

//               {/* Liste des publications */}
//               <div className="divide-y divide-gray-200">
//                 {publicationsFiltreesAffichage.length === 0 ? (
//                   <div className="px-6 py-12 text-center">
//                     <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune publication</h3>
//                     <p className="text-gray-500">
//                       {filtreStatut === 'toutes' 
//                         ? "Commencez par créer votre première publication"
//                         : `Aucune publication ${filtreStatut}`
//                       }
//                     </p>
//                   </div>
//                 ) : (
//                   publicationsFiltreesAffichage.map(publication => {
//                     const contenu = contenus.find(c => c.id === publication.id_contenu);
//                     const plateforme = plateformesDisponibles.find(p => p.id === publication.id_plateforme);
                    
//                     return (
//                       <div key={publication.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
//                         <div className="flex items-start justify-between">
                          
//                           {/* Informations de la publication */}
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center gap-3 mb-2">
//                               <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatutColor(publication.statut)}`}>
//                                 {getStatutIcon(publication.statut)}
//                                 {publication.statut}
//                               </span>
//                               {plateforme && (
//                                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                                   {plateforme.nom}
//                                 </span>
//                               )}
//                             </div>
                            
//                             <h3 className="font-semibold text-gray-900 mb-1">
//                               {publication.titre_publication}
//                             </h3>
                            
//                             {contenu && (
//                               <p className="text-sm text-gray-600 line-clamp-2 mb-2">
//                                 {contenu.contenu_textuel?.substring(0, 100)}...
//                               </p>
//                             )}
                            
//                             <div className="flex items-center gap-4 text-xs text-gray-500">
//                               <span>
//                                 Créé le {new Date(publication.date_creation).toLocaleDateString('fr-FR')}
//                               </span>
//                               {publication.date_programmee && (
//                                 <span>
//                                   Programmé le {new Date(publication.date_programmee).toLocaleDateString('fr-FR')}
//                                 </span>
//                               )}
//                               {publication.date_publication && (
//                                 <span>
//                                   Publié le {new Date(publication.date_publication).toLocaleDateString('fr-FR')}
//                                 </span>
//                               )}
//                             </div>
                            
//                             {publication.message_erreur && (
//                               <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
//                                 {publication.message_erreur}
//                               </div>
//                             )}
//                           </div>

//                           {/* Actions */}
//                           <div className="flex items-center gap-2 ml-4">
//                             {publication.statut === StatutPublicationEnum.brouillon && (
//                               <button
//                                 onClick={() => handlePublier(publication.id)}
//                                 disabled={etatsChargement.isPublishing}
//                                 className="text-green-600 hover:text-green-700 disabled:opacity-50 p-1"
//                                 title="Publier maintenant"
//                               >
//                                 <Play className="w-4 h-4" />
//                               </button>
//                             )}
                            
//                             {publication.statut === StatutPublicationEnum.programme && (
//                               <button
//                                 onClick={() => {
//                                   setPublicationSelectionnee(publication);
//                                   setShowModal(true);
//                                 }}
//                                 disabled={etatsChargement.isScheduling}
//                                 className="text-blue-600 hover:text-blue-700 disabled:opacity-50 p-1"
//                                 title="Reprogrammer"
//                               >
//                                 <Calendar className="w-4 h-4" />
//                               </button>
//                             )}
                            
//                             <button
//                               onClick={() => handleSupprimer(publication.id)}
//                               disabled={etatsChargement.isDeleting}
//                               className="text-red-600 hover:text-red-700 disabled:opacity-50 p-1"
//                               title="Supprimer"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal de création/modification */}
//       {showModal && (
//         <PublicationModal
//           publication={publicationSelectionnee}
//           onClose={() => {
//             setShowModal(false);
//             setPublicationSelectionnee(null);
//           }}
//           onSave={async (data) => {
//             if (publicationSelectionnee) {
//               await actions.modifier(publicationSelectionnee.id, data);
//             } else {
//               await actions.creer(data);
//             }
//             setShowModal(false);
//             setPublicationSelectionnee(null);
//           }}
//           contenus={contenus}
//           plateformes={plateformesDisponibles}
//           isLoading={etatsChargement.isCreating || etatsChargement.isUpdating}
//         />
//       )}
//     </div>
//   );
// }

// // Composant de carte de statistique
// const StatCard = ({ title, value, icon, color }: any) => (
//   <div className="bg-white border border-gray-200 rounded-lg p-4">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-sm font-medium text-gray-600">{title}</p>
//         <p className="text-2xl font-bold text-gray-900">{value}</p>
//       </div>
//       <div className={color}>
//         {icon}
//       </div>
//     </div>
//   </div>
// );

// // Composant Modal pour créer/modifier une publication
// const PublicationModal = ({ publication, onClose, onSave, contenus, plateformes, isLoading }: any) => {
//   const [formData, setFormData] = useState({
//     id_contenu: publication?.id_contenu || '',
//     id_plateforme: publication?.id_plateforme || '',
//     titre_publication: publication?.titre_publication || '',
//     statut: publication?.statut || StatutPublicationEnum.brouillon,
//     date_programmee: publication?.date_programmee || '',
//     parametres_publication: publication?.parametres_publication || {},
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900">
//             {publication ? 'Modifier la publication' : 'Nouvelle publication'}
//           </h2>
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-2 text-gray-700">
//               Contenu <span className="text-red-500">*</span>
//             </label>
//             <select
//               required
//               className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
//               value={formData.id_contenu}
//               onChange={(e) => setFormData({...formData, id_contenu: e.target.value})}
//             >
//               <option value="">Choisir un contenu</option>
//               {contenus.map((contenu: any) => (
//                 <option key={contenu.id} value={contenu.id}>
//                   {contenu.titre || `Contenu #${contenu.id}`}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2 text-gray-700">
//               Plateforme <span className="text-red-500">*</span>
//             </label>
//             <select
//               required
//               className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
//               value={formData.id_plateforme}
//               onChange={(e) => setFormData({...formData, id_plateforme: e.target.value})}
//             >
//               <option value="">Choisir une plateforme</option>
//               {plateformes.map((plateforme: any) => (
//                 <option key={plateforme.id} value={plateforme.id}>
//                   {plateforme.nom}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2 text-gray-700">
//               Titre <span className="text-red-500">*</span>
//             </label>
//             <input
//               required
//               type="text"
//               className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//               value={formData.titre_publication}
//               onChange={(e) => setFormData({...formData, titre_publication: e.target.value})}
//               placeholder="Titre de la publication"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2 text-gray-700">
//               Statut
//             </label>
//             <select
//               className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
//               value={formData.statut}
//               onChange={(e) => setFormData({...formData, statut: e.target.value})}
//             >
//               <option value={StatutPublicationEnum.brouillon}>Brouillon</option>
//               <option value={StatutPublicationEnum.programme}>Programmé</option>
//             </select>
//           </div>

//           {formData.statut === StatutPublicationEnum.programme && (
//             <div>
//               <label className="block text-sm font-medium mb-2 text-gray-700">
//                 Date de programmation
//               </label>
//               <input
//                 type="datetime-local"
//                 className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                 value={formData.date_programmee}
//                 onChange={(e) => setFormData({...formData, date_programmee: e.target.value})}
//               />
//             </div>
//           )}

//           <div className="flex justify-end gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//             >
//               Annuler
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
//             >
//               {isLoading ? 'Enregistrement...' : publication ? 'Modifier' : 'Créer'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

'use client';

import React, { useState } from 'react';
import {
  usePublications,
  usePublicationStats,
  usePublicationsAttention,
} from '@/hooks/usePublication'; 
// import {
//   StatutPublicationEnum,
//   Publication,
// } from '../';

import { Loader2, Plus, AlertTriangle, Clock, BarChart } from 'lucide-react';
import {  StatutPublicationEnum,Publication, } from '@/types/publication';
interface SimpleCardProps {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerIcon?: React.ReactNode;
}

const SimpleCard: React.FC<SimpleCardProps> = ({ title, children, className = '', headerIcon }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
    {title && (
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
            {headerIcon}
            <span>{title}</span>
        </h3>
      </div>
    )}
    {children}
  </div>
);

// 2. Composant Button (remplace Button)
interface SimpleButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

const SimpleButton: React.FC<SimpleButtonProps> = ({ onClick, children, className = '', disabled, isLoading }) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${className} ${
      (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
    }`}
  >
    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
  </button>
);

// 3. Composant Badge (remplace Badge)
const SimpleBadge: React.FC<{ children: React.ReactNode; className: string }> = ({ children, className }) => (
  <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold leading-4 rounded-full ${className}`}>
    {children}
  </span>
);

// 4. Composant StatCard (utilise SimpleCard)
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div className={`text-${color}-500`}>{icon}</div>
    </div>
    <div className="pt-1">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  </div>
);

// --- Logique du Tableau de Bord ---

export default function PublicationDashboard() {
  const {
    publications,
    statistiques,
    prochainesPublications,
    etatsChargement,
    actions,
    refetch,
    isLoading,
    error,
  } = usePublications();
  const { stats, isLoading: isLoadingStats } = usePublicationStats();
  const { publicationsAttention } = usePublicationsAttention();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication| null>(null);

  const handleAdd = () => {
    setSelectedPublication(null);
    setIsModalOpen(true);
    // Logique d'ouverture de modal à implémenter
    alert("Ouverture du formulaire de création de publication...");
  };

  const handleEdit = (pub: Publication) => {
    setSelectedPublication(pub);
    setIsModalOpen(true);
    // Logique d'ouverture de modal à implémenter
    alert(`Ouverture du formulaire pour modifier la publication ID: ${pub.id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette publication ?')) {
      try {
        await actions.supprimer(id);
        alert('✅ Publication supprimée avec succès.');
      } catch (e) {
        console.error('Erreur suppression:', e);
        alert('❌ Erreur lors de la suppression.');
      }
    }
  };

  const handlePublish = async (id: number) => {
    if (window.confirm('Voulez-vous publier cette publication immédiatement ?')) {
      try {
        await actions.publier(id);
        alert('✅ Publication lancée avec succès.');
      } catch (e) {
        console.error('Erreur publication:', e);
        alert('❌ Erreur lors de la publication.');
      }
    }
  };

  // Fonction utilitaire pour le statut (utilise SimpleBadge)
  const getStatusBadge = (statut: StatutPublicationEnum) => {
    let color = 'bg-gray-200 text-gray-800'; // Default
    let text = 'Inconnu';

    switch (statut) {
      case StatutPublicationEnum.brouillon:
        color = 'bg-blue-100 text-blue-800';
        text = 'Brouillon';
        break;
      case StatutPublicationEnum.programme:
        color = 'bg-yellow-100 text-yellow-800';
        text = 'Programmé';
        break;
      case StatutPublicationEnum.publie:
        color = 'bg-green-100 text-green-800';
        text = 'Publié';
        break;
      case StatutPublicationEnum.erreur:
        color = 'bg-red-100 text-red-800';
        text = 'Erreur';
        break;
    }

    return <SimpleBadge className={color}>{text}</SimpleBadge>;
  };

  if (isLoading || etatsChargement.isLoadingGlobal) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-blue-600" />
        <span className="text-xl font-semibold text-gray-700">
          Chargement des publications...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-100 rounded-lg m-8">
        <h2 className="text-2xl font-bold mb-2">Erreur de chargement</h2>
        <p>
          Impossible de récupérer les données :{' '}
          {error instanceof Error ? error.message : 'Erreur inconnue'}
        </p>
        <SimpleButton 
            onClick={() => refetch()} 
            className="mt-4 bg-red-600 text-white"
        >
          Réessayer
        </SimpleButton>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête du Tableau de Bord */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Tableau de Bord des Publications
          </h1>
          <SimpleButton
            onClick={handleAdd}
            className="bg-blue-600 text-white shadow-md"
          >
            <Plus className="h-5 w-5" />
            <span>Nouvelle Publication</span>
          </SimpleButton>
        </div>

        {/* --- */}

        ## Aperçu des Statistiques
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Publications"
            value={statistiques.total}
            icon={<BarChart className="h-4 w-4" />}
            color="indigo"
          />
          <StatCard
            title="Programmé (7 Jours)"
            value={statistiques.prochaines}
            icon={<Clock className="h-4 w-4" />}
            color="yellow"
          />
          <StatCard
            title="Taux de Succès"
            value={`${stats.tauxReussite}%`}
            icon={<BarChart className="h-4 w-4" />}
            color="green"
          />
          <StatCard
            title="En Erreur"
            value={statistiques.enErreur}
            icon={<AlertTriangle className="h-4 w-4" />}
            color="red"
          />
        </div>

        {/* --- */}

        ## Attention & Programmation
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Bloc d'Attention */}
          <SimpleCard
            className="lg:col-span-2"
            title="Publications Nécessitant Attention"
            headerIcon={<AlertTriangle className="h-5 w-5 text-red-700" />}
          >
            <ul className="space-y-3">
                <li className="text-gray-700">
                  <span className="font-bold text-red-600">
                    {publicationsAttention.enErreur.length} Erreur(s) :
                  </span>{' '}
                  à vérifier immédiatement.
                </li>
                <li className="text-gray-700">
                  <span className="font-bold text-orange-600">
                    {publicationsAttention.programmationsImminentes.length}{' '}
                    Programmation(s) Imminente(s) :
                  </span>{' '}
                  prévues dans les 24h.
                </li>
                <li className="text-gray-700">
                  <span className="font-bold text-amber-600">
                    {publicationsAttention.brouillonsAnciens.length} Brouillon(s) Ancien(s) :
                  </span>{' '}
                  non modifiés depuis plus de 7 jours.
                </li>
              </ul>
          </SimpleCard>

          {/* Bloc Prochaines Programmations */}
          <SimpleCard
            title="Prochaines Programmations (7 Jours)"
            headerIcon={<Clock className="h-5 w-5 text-gray-700" />}
          >
            {prochainesPublications.length === 0 ? (
              <p className="text-gray-500 italic">
                Aucune publication programmée pour la semaine prochaine.
              </p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {prochainesPublications.slice(0, 5).map((pub) => (
                  <li key={pub.id} className="text-sm border-b pb-2 last:border-b-0 last:pb-0">
                    <p className="font-medium truncate">{pub.titre_publication || 'Sans titre'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(pub.date_programmee!).toLocaleString()}
                    </p>
                  </li>
                ))}
                {prochainesPublications.length > 5 && (
                  <li className="text-sm text-center text-gray-500 pt-2">
                    ...et {prochainesPublications.length - 5} autres
                  </li>
                )}
              </ul>
            )}
          </SimpleCard>
        </div>

        {/* --- */}

        ## Liste Complète des Publications
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Titre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                >
                  Statut
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                >
                  Date Pro.
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Plateforme
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {publications.map((pub) => (
                <tr
                  key={pub.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">
                    {pub.titre_publication || `Publication #${pub.id}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm hidden sm:table-cell">
                    {getStatusBadge(pub.statut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {pub.date_programmee
                      ? new Date(pub.date_programmee).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    ID: {pub.id_plateforme}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <SimpleButton
                        onClick={() => handleEdit(pub)}
                        className="text-indigo-600 bg-transparent hover:bg-indigo-50"
                        disabled={etatsChargement.isMutating}
                      >
                        Modifier
                      </SimpleButton>
                      {pub.statut === StatutPublicationEnum.brouillon && (
                        <SimpleButton
                          onClick={() => handlePublish(pub.id)}
                          className="text-green-600 bg-transparent hover:bg-green-50"
                          disabled={etatsChargement.isMutating}
                          isLoading={etatsChargement.isPublishing}
                        >
                          Publier
                        </SimpleButton>
                      )}
                      <SimpleButton
                        onClick={() => handleDelete(pub.id)}
                        className="text-red-600 bg-transparent hover:bg-red-50"
                        disabled={etatsChargement.isMutating}
                      >
                        Supprimer
                      </SimpleButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Intégration du composant Modal pour la création/édition ici */}
    </div>
  );
}