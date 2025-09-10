import ProjetTableModal from "@/app/component/ui/projet/projetTableModal"
import PrompInputModal from "@/app/component/ui/prompt/promptInputModal";

export default function ProjetPage() {
  return(
    <div >
      <ProjetTableModal />
      {/* <PrompInputModal/> */}
    </div>
  );
}
// app/projets/create/page.tsx
// 'use client';

// import { useState } from 'react';
// import { useCreateProjet } from '@/app/api/projet';

// export default function CreateProjetPage() {
//   const [formData, setFormData] = useState({
//     id_utilisateur: '',
//     nom_projet: '',
//     description: '',
//     status: 'draft',
//     configuration: '',
//   });
//   const [jsonError, setJsonError] = useState<string | null>(null);

//   const { mutate, isPending, isError, error, data } = useCreateProjet();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setJsonError(null); // Reset JSON error state

//     // Validate configuration JSON
//     let configuration;
//     if (formData.configuration) {
//       try {
//         configuration = JSON.parse(formData.configuration);
//       } catch (err) {
//         setJsonError('Invalid JSON format in configuration field');
//         return;
//       }
//     }

//     const payload = {
//       id_utilisateur: parseInt(formData.id_utilisateur),
//       nom_projet: formData.nom_projet,
//       description: formData.description,
//       status: formData.status,
//       configuration, // Will be undefined if no configuration is provided
//     };

//     mutate(payload);
//   };

//   return (
//     <div className='bg-black'>

//     <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
//       <h1>Create New Projet</h1>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ display: 'block', marginBottom: '5px' }}>
//             User ID
//           </label>
//           <input
//             type="number"
//             value={formData.id_utilisateur}
//             onChange={(e) =>
//               setFormData({ ...formData, id_utilisateur: e.target.value })
//             }
//             required
//             style={{ width: '100%', padding: '8px' }}
//           />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ display: 'block', marginBottom: '5px' }}>
//             Project Name
//           </label>
//           <input
//             type="text"
//             value={formData.nom_projet}
//             onChange={(e) =>
//               setFormData({ ...formData, nom_projet: e.target.value })
//             }
//             required
//             style={{ width: '100%', padding: '8px' }}
//           />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ display: 'block', marginBottom: '5px' }}>
//             Description
//           </label>
//           <textarea
//             value={formData.description}
//             onChange={(e) =>
//               setFormData({ ...formData, description: e.target.value })
//             }
//             required
//             style={{ width: '100%', padding: '8px', minHeight: '100px' }}
//           />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ display: 'block', marginBottom: '5px' }}>
//             Status
//           </label>
//           <select
//             value={formData.status}
//             onChange={(e) =>
//               setFormData({ ...formData, status: e.target.value })
//             }
//             style={{ width: '100%', padding: '8px' }}
//           >
//             <option value="draft">Draft</option>
//             <option value="active">Active</option>
//             <option value="completed">Completed</option>
//           </select>
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ display: 'block', marginBottom: '5px' }}>
//             Configuration (JSON)
//           </label>
//           <textarea
//             value={formData.configuration}
//             onChange={(e) =>
//               setFormData({ ...formData, configuration: e.target.value })
//             }
//             placeholder='{"key": "value"}'
//             style={{ width: '100%', padding: '8px', minHeight: '100px' }}
//           />
//           {jsonError && (
//             <p style={{ color: 'red', marginTop: '5px' }}>{jsonError}</p>
//           )}
//         </div>
//         <button
//           type="submit"
//           disabled={isPending}
//           style={{
//             padding: '10px 20px',
//             backgroundColor: isPending ? '#ccc' : '#0070f3',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: isPending ? 'not-allowed' : 'pointer',
//           }}
//         >
//           {isPending ? 'Creating...' : 'Create Projet'}
//         </button>
//       </form>

//       {/* Status Messages */}
//       {isPending && (
//         <p style={{ color: 'blue', marginTop: '10px' }}>
//           Submitting project...
//         </p>
//       )}
//       {isError && (
//         <p style={{ color: 'red', marginTop: '10px' }}>
//           Error: {error?.message || 'Failed to create project'}
//         </p>
//       )}
//       {data && (
//         <p style={{ color: 'green', marginTop: '10px' }}>
//           Success: {data.message} (Project ID: {data.projet_id})
//         </p>
//       )}
//     </div>
//    </div> 
//   );
// }