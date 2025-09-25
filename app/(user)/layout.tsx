'use client';

import Link from 'next/link';
import { UserProvider, useUser } from '../context/userContext';
import { useEffect, useState } from 'react';

const Header = () => {
  const { isAdmin, utilisateur, logout, isLoading } = useUser();
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className='bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center'>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1 className='text-2xl font-bold'>Admin Panel</h1>
          {utilisateur && (
            <div>
              Connecté en tant que: <span className='font-semibold'>{utilisateur.prenom}</span>
              {isAdmin && (
                <span className='ml-2 px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-medium'>
                  Admin
                </span>
              )}
              <button
                onClick={logout}
                className='ml-4 bg-gray-600 text-white px-3 py-1 rounded-md'
              >
                Déconnexion
              </button>
            </div>
          )}
        </>
      )}
    </header>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <div className='flex flex-1'>
          <aside className="w-64 bg-white dark:bg-gray-800 p-6 shadow-md transition-all duration-300">
            <nav className="space-y-4">
              <h2 className="text-xl font-bold">Tableau de bord</h2>
              <ul className="space-y-2">
                {[
                  { href: '/dashboard', label: 'Home' },
                  { href: '/projet', label: 'Projet' },
                  { href: '/prompt', label: 'Prompt' },
                  { href: '/modelIA', label: 'ModelIA' },
                  { href: '/template', label: 'Template' },
                  { href: '/generer', label: 'Generer' },
                  { href: '/historique', label: 'Historique' },
                  { href: '/utilisateurs', label: 'Utilisateur' },
                  { href: '/plateforme', label: 'Plateforme' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <main className="p-6 flex-1">
            {children}
          </main>
        </div>
      </div>
    </UserProvider>
  );
}
