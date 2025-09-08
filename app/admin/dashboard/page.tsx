'use client'

'use client';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

// Fonction de fetching pour les étudiants
const fetchStudents = async () => {
  const res = await fetch('/api/student');
  if (!res.ok) {
    throw new Error("Échec du chargement des étudiants.");
  }
  const data = await res.json();
  return data.length;
};

// Fonction de fetching pour les frais
const fetchFees = async () => {
  const res = await fetch('/api/fees');
  if (!res.ok) {
    throw new Error("Échec du chargement des frais.");
  }
  const data = await res.json();
  return data.length;
};

// Fonction de fetching pour les paiements
const fetchPayments = async () => {
  const res = await fetch('/api/pay');
  if (!res.ok) {
    throw new Error("Échec du chargement des paiements.");
  }
  const data = await res.json();
  return data.length;
};

export default function DashboardPage() {
  const { data: studentCount, isLoading: studentsLoading, error: studentsError } = useQuery({
    queryKey: ['studentCount'],
    queryFn: fetchStudents,
  });

  const { data: feesCount, isLoading: feesLoading, error: feesError } = useQuery({
    queryKey: ['feesCount'],
    queryFn: fetchFees,
  });

  const { data: payCount, isLoading: payLoading, error: payError } = useQuery({
    queryKey: ['payCount'],
    queryFn: fetchPayments,
  });

  const isLoading = studentsLoading || feesLoading || payLoading;
  const isError = studentsError || feesError || payError;
  const userName = 'Nom de l\'utilisateur'; // Remplacez par le nom de l'utilisateur de l'authentification

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Welcome on dashboard !
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300">
        Hello, {userName}. You can navigate with the left sidebar.
      </p>

      {isLoading ? (
        <div className="text-center text-lg text-gray-600 dark:text-gray-400">Loading data...</div>
      ) : isError ? (
        <div className="text-center text-lg text-red-500">
          Erreur : {(studentsError || feesError || payError)?.message}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105">
            <h3 className="text-2xl font-semibold mb-2 text-blue-600">Total students</h3>
            <p className="text-4xl font-bold">{studentCount}</p>
            <p className="text-sm text-gray-500">Frequency update</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105">
            <h3 className="text-2xl font-semibold mb-2 text-green-600">Paiements</h3>
            <p className="text-4xl font-bold">{payCount}</p>
            <p className="text-sm text-gray-500">Total paiements</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105">
            <h3 className="text-2xl font-semibold mb-2 text-red-600">Fees</h3>
            <p className="text-4xl font-bold">{feesCount}</p>
            <p className="text-sm text-gray-500">Total of fees</p>
          </div>
        </div>
      )}
    </div>
  );
}