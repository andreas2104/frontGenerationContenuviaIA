'use client';

import Link from 'next/link';
import { UserProvider, useUser } from '../context/userContext';
import { SearchProvider, useSearch } from '../context/searchContext';
import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

const Header = () => {
  const { isAdmin, utilisateur, logout, isLoading } = useUser();
  const { searchQuery, setSearchQuery, clearSearch } = useSearch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Recherche globale:', searchQuery);
      // La recherche est maintenant disponible dans tout l'app via le contexte
    }
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  if (!mounted) return null;

  return (
    <header className='bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 h-16'>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Partie gauche avec titre et recherche */}
          <div className='flex items-center gap-8 flex-1'>
            <h1 className='text-2xl font-bold min-w-max'>Admin Panel</h1>
            
            {/* Barre de recherche centrale avec clear */}
            <form onSubmit={handleSearch} className='relative flex-1 max-w-2xl'>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='Rechercher dans toutes les sections...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                <Search 
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' 
                  size={20} 
                />
                {searchQuery && (
                  <button
                    type='button'
                    onClick={handleClearSearch}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Partie droite avec infos utilisateur */}
          {utilisateur && (
            <div className='flex items-center gap-4 ml-4'>
              <span className='hidden lg:inline text-sm'>
                <span className='font-semibold'>{utilisateur.prenom}</span>
              </span>
              {isAdmin && (
                <span className='px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-medium'>
                  Admin
                </span>
              )}
              <button
                onClick={logout}
                className='bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors text-sm'
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

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-6 shadow-md fixed left-0 top-16 bottom-0 z-40 overflow-y-auto">
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
            { href: '/contenu', label: 'Contenu' },
            { href: '/utilisateurs', label: 'Utilisateur' },
            { href: '/adminPlateforme', label: 'AdminPlateforme' },
            { href: '/plateforme', label: 'Plateforme' },
            { href: '/publication', label: 'Publication' },
            { href: '/historique', label: 'Historique' },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <span className="font-medium">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <SearchProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Header />
          <Sidebar />
          
          {/* Contenu principal avec marge pour le header et sidebar */}
          <main className="ml-64 mt-16 p-6 min-h-screen">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 min-h-[calc(100vh-8rem)]">
              {children}
            </div>
          </main>
        </div>
      </SearchProvider>
    </UserProvider>
  );
}