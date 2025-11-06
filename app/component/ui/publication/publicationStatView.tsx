'use client';

import React from 'react';
import { BarChart, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface PublicationStatViewProps {
  statistiques: {
    total: number;
    programmees: number;
    publiees: number;
    enEchec: number;
  };
}

const PublicationStatView: React.FC<PublicationStatViewProps> = ({ statistiques }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-indigo-100 border-l-4 border-indigo-500 p-4 rounded-xl shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-700 font-semibold">Total Publications</p>
            <h2 className="text-3xl font-bold text-indigo-900 mt-1">{statistiques.total}</h2>
          </div>
          <BarChart className="h-8 w-8 text-indigo-600" />
        </div>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-xl shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-700 font-semibold">Programmées</p>
            <h2 className="text-3xl font-bold text-yellow-900 mt-1">{statistiques.programmees}</h2>
          </div>
          <Clock className="h-8 w-8 text-yellow-600" />
        </div>
      </div>

      <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-xl shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-700 font-semibold">Publiées</p>
            <h2 className="text-3xl font-bold text-green-900 mt-1">{statistiques.publiees}</h2>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-xl shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-700 font-semibold">En Erreur</p>
            <h2 className="text-3xl font-bold text-red-900 mt-1">{statistiques.enEchec}</h2>
          </div>
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
      </div>
    </div>
  );
};

export default PublicationStatView;
