'use client'

import { useProjet } from "@/hooks/useProjet"
import { useTemplate } from "@/hooks/useTemplate"
import { usePrompt } from "@/hooks/usePrompt"
import { useUtilisateurs } from "@/hooks/useUtilisateurs"
import { useContenu } from "@/hooks/useContenu"
import { useCurrentUtilisateur } from "@/hooks/useUtilisateurs";
import { useState, useEffect } from "react";

// Import de Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const { projets, isLoading: isLoadingProjets } = useProjet();
  const { templates, isPending: isLoadingTemplates } = useTemplate();
  const { prompt, isPending: isLoadingPrompts } = usePrompt();
  const { utilisateurs, isLoading: isLoadingUsers } = useUtilisateurs();
  const { contenus, isPending: isLoadingContenus } = useContenu();
  const { utilisateur, isAdmin, isLoading: isUserLoading } = useCurrentUtilisateur();

  // État pour le type de graphique
  const [chartType, setChartType] = useState<'bar' | 'line' | 'doughnut'>('bar');

  if (isUserLoading || isLoadingProjets || isLoadingTemplates || isLoadingPrompts || isLoadingUsers || isLoadingContenus) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-xl font-semibold text-gray-900">Chargement du dashboard...</div>
      </div>
    );
  }

  if (!utilisateur) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-center">
          <p className="text-xl text-red-600 font-semibold mb-4">Utilisateur non connecté</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Aller à la connexion
          </button>
        </div>
      </div>
    );
  }

  // Filtrer les données selon les droits de l'utilisateur
  const filteredProjets = isAdmin 
    ? projets 
    : projets.filter(p => Number(p.id_utilisateur) === Number(utilisateur.id));

  const filteredTemplates = isAdmin 
    ? templates 
    : templates.filter(t => Number(t.id_utilisateur) === Number(utilisateur.id));

  const filteredPrompts = isAdmin 
    ? prompt 
    : prompt.filter(p => Number(p.id_utilisateur) === Number(utilisateur.id));

  const filteredContenus = isAdmin 
    ? contenus 
    : contenus.filter(c => Number(c.id_utilisateur) === Number(utilisateur.id));

  // Statistiques principales
  const totalProjets = filteredProjets.length;
  const totalTemplates = filteredTemplates.length;
  const totalPrompts = filteredPrompts.length;
  const totalContenus = filteredContenus.length;
  const totalUsers = isAdmin ? utilisateurs.length : 1;

  // Statistiques Contenu pour le graphique
  const contenusTexte = filteredContenus.filter(c => c.type_contenu === 'text').length;
  const contenusImage = filteredContenus.filter(c => c.type_contenu === 'image').length;
  const contenusMultimodal = filteredContenus.filter(c => c.type_contenu === 'multimodal').length;
  const contenusVideo = filteredContenus.filter(c => c.type_contenu === 'video').length;

  // Données pour le graphique des contenus
  const chartData = {
    labels: ['Texte', 'Image', 'Multimodal', 'Vidéo'],
    datasets: [
      {
        label: 'Nombre de contenus',
        data: [contenusTexte, contenusImage, contenusMultimodal, contenusVideo],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(139, 92, 246)',
          'rgb(245, 158, 11)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Répartition des types de contenu',
      },
    },
  };

  // Données pour le graphique en ligne (évolution mensuelle)
  const monthlyData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Contenus créés',
        data: [12, 19, 8, 15, 12, 16, 14, 18, 12, 16, 14, 17], // Données simulées
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Évolution des contenus créés (2024)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Données pour le graphique en anneau
  const doughnutData = {
    labels: ['Projets', 'Templates', 'Prompts', 'Contenus'],
    datasets: [
      {
        label: 'Total',
        data: [totalProjets, totalTemplates, totalPrompts, totalContenus],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(139, 92, 246)',
          'rgb(245, 158, 11)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Répartition globale des éléments',
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de Bord {isAdmin && '(Administrateur)'}
        </h1>
        <p className="text-gray-600">
          Bienvenue, <span className="font-semibold text-gray-800">{utilisateur.prenom} {utilisateur.nom}</span>
          {isAdmin && (
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
              Admin
            </span>
          )}
        </p>
      </div>

      {/* SECTION 1: Vue d'ensemble rapide */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vue d'ensemble</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Carte Projets */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projets</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{totalProjets}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {filteredProjets.filter(p => p.status === 'active').length} actifs
              </div>
            </div>
          </div>

          {/* Carte Templates */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Templates</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{totalTemplates}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {filteredTemplates.filter(t => t.public).length} publics
              </div>
            </div>
          </div>

          {/* Carte Prompts */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prompts</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{totalPrompts}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {filteredPrompts.reduce((sum, p) => sum + p.utilisation_count, 0)} utilisations
              </div>
            </div>
          </div>

          {/* Carte Utilisateurs (Admin seulement) ou Contenus */}
          {isAdmin ? (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                  <p className="text-3xl font-bold text-pink-600 mt-2">{totalUsers}</p>
                </div>
                <div className="p-3 bg-pink-100 rounded-lg">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                  {utilisateurs.filter(u => u.type_compte === 'admin').length} admins
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contenus</p>
                  <p className="text-3xl font-bold text-teal-600 mt-2">{totalContenus}</p>
                </div>
                <div className="p-3 bg-teal-100 rounded-lg">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {contenusMultimodal} multimodaux
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Graphiques des statistiques de contenu */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Statistiques des contenus générés</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === 'bar' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Barres
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === 'line' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Ligne
            </button>
            <button
              onClick={() => setChartType('doughnut')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === 'doughnut' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Anneau
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique principal */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            {chartType === 'bar' && <Bar data={chartData} options={chartOptions} />}
            {chartType === 'line' && <Line data={monthlyData} options={lineOptions} />}
            {chartType === 'doughnut' && <Doughnut data={doughnutData} options={doughnutOptions} />}
          </div>

          {/* Détails des statistiques */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails des contenus</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Contenus texte</span>
                </div>
                <span className="font-semibold text-blue-600">{contenusTexte}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Contenus image</span>
                </div>
                <span className="font-semibold text-green-600">{contenusImage}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Contenus multimodaux</span>
                </div>
                <span className="font-semibold text-purple-600">{contenusMultimodal}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Contenus vidéo</span>
                </div>
                <span className="font-semibold text-yellow-600">{contenusVideo}</span>
              </div>

              {/* Statistiques globales */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{totalContenus}</p>
                    <p className="text-sm text-gray-600">Total contenus</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {totalContenus > 0 ? Math.round((contenusMultimodal / totalContenus) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-600">Multimodaux</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Actions rapides */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => window.location.href = '/projets'}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group hover:border-blue-300"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Gérer les Projets</h3>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">Créer et organiser vos projets de contenu</p>
          </button>

          <button 
            onClick={() => window.location.href = '/contenus'}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group hover:border-teal-300"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Historique des Contenus</h3>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">Consulter et gérer tous vos contenus générés</p>
          </button>

          {isAdmin ? (
            <button 
              onClick={() => window.location.href = '/admin/utilisateurs'}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group hover:border-pink-300"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Gérer les Utilisateurs</h3>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-pink-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm">Administrer les comptes et permissions</p>
            </button>
          ) : (
            <button 
              onClick={() => window.location.href = '/generer'}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group hover:border-green-300"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Générer du Contenu</h3>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm">Créer de nouveaux contenus avec l'IA</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}