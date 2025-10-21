'use client';

import Link from 'next/link';
import { UserProvider, useUser } from '../context/userContext';
import { SearchProvider, useSearch } from '../context/searchContext';
import { useEffect, useState } from 'react';
import { Search, X, Home, Folder, MessageSquare, Cpu, Layout, Zap, FileText, Users, Shield, Globe, Share, History, LogOut, User2, Menu, ChevronDown, ChevronUp } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Header = () => {
  const { isAdmin, utilisateur, logout, isLoading } = useUser();
  const { searchQuery, setSearchQuery, clearSearch } = useSearch();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Recherche globale:', searchQuery);
    }
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  if (!mounted) return null;

  return (
    <header className='bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 h-16'>
      {isLoading ? (
        <div className="flex items-center justify-center w-full">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Logo et menu hamburger */}
          <div className='flex items-center gap-4 flex-1'>
            <button
              onClick={toggleMobileMenu}
              className='lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
            
            <h1 className='text-xl lg:text-2xl font-bold min-w-max'>Media Tower</h1>
          </div>

          {/* Barre de recherche - Desktop */}
          <form onSubmit={handleSearch} className='hidden lg:block relative flex-1 max-w-2xl mx-4'>
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

          {/* Barre de recherche - Mobile (expandable) */}
          <div className='lg:hidden flex items-center'>
            {!isSearchExpanded ? (
              <button
                onClick={toggleSearch}
                className='p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                aria-label="Open search"
              >
                <Search size={20} />
              </button>
            ) : (
              <div className='absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-lg border-b border-gray-200 dark:border-gray-700'>
                <form onSubmit={handleSearch} className='relative'>
                  <input
                    type='text'
                    placeholder='Rechercher...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    autoFocus
                  />
                  <Search 
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' 
                    size={20} 
                  />
                  <button
                    type='button'
                    onClick={() => {
                      toggleSearch();
                      handleClearSearch();
                    }}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                  >
                    <X size={18} />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* User info and logout */}
          {utilisateur && (
            <div className='flex items-center gap-2 lg:gap-4 ml-2 lg:ml-4'>
              <span className='hidden sm:inline text-sm'>
                <span className='font-semibold'>{utilisateur.prenom}</span>
              </span>
              {isAdmin && (
                <span className='hidden sm:inline px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium'>
                  Admin
                </span>
              )}
              <button
                onClick={logout}
                className='p-2 lg:px-3 lg:py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm'
                aria-label="Logout"
              >
                <LogOut size={18} className="lg:mr-1" />
                <span className="hidden lg:inline"></span>
              </button>
            </div>
          )}
        </>
      )}
    </header>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const { isAdmin } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    main: true,
    admin: true
  });

  useEffect(() => {
    // Fermer le menu mobile quand la route change
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActiveLink = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href !== '/dashboard' && pathname.startsWith(href)) return true;
    return false;
  };

  const getLinkClasses = (href: string) => {
    const baseClasses = "flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 font-medium group w-full text-left";
    
    if (isActiveLink(href)) {
      return `${baseClasses} bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500 shadow-sm`;
    } else {
      return `${baseClasses} hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100`;
    }
  };

  // Menu de base pour tous les utilisateurs
  const baseMenuItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/projet', label: 'Projet', icon: Folder },
    { href: '/prompt', label: 'Prompt', icon: MessageSquare },
    { href: '/template', label: 'Template', icon: Layout },
    { href: '/generer', label: 'Generer', icon: Zap },
    { href: '/contenu', label: 'Contenu', icon: FileText },
    { href: '/plateforme', label: 'Plateforme', icon: Globe },
    { href: '/publication', label: 'Publication', icon: Share },
  ];

  // Menu admin seulement
  const adminMenuItems = [
    { href: '/modelIA', label: 'ModelIA', icon: Cpu },
    { href: '/utilisateurs', label: 'Utilisateur', icon: Users },
    { href: '/adminPlateforme', label: 'AdminPlateforme', icon: Shield },
  ];

  return (
    <>
      {/* Overlay pour mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white dark:bg-gray-800 p-6 shadow-md fixed left-0 top-16 bottom-0 z-40 overflow-y-auto border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <nav className="space-y-2">
          {/* Menu principal avec accordéon sur mobile */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('main')}
              className="flex items-center justify-between w-full p-3 text-left lg:cursor-default"
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Navigation {isAdmin && <span className="text-xs text-green-600">(Admin)</span>}
              </h2>
              <div className="lg:hidden">
                {expandedSections.main ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>
            
            {(expandedSections.main || !isMobileMenuOpen) && (
              <ul className="space-y-1 mt-2">
                {baseMenuItems.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={getLinkClasses(link.href)}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <IconComponent 
                          size={20} 
                          className={isActiveLink(link.href) 
                            ? "text-blue-600 dark:text-blue-400" 
                            : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                          } 
                        />
                        <span className="flex-1">{link.label}</span>
                        {isActiveLink(link.href) && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Section Admin avec accordéon */}
          {isAdmin && (
            <div className="my-4 border-t border-gray-200 dark:border-gray-600 pt-4">
              <button
                onClick={() => toggleSection('admin')}
                className="flex items-center justify-between w-full p-3 text-left lg:cursor-default"
              >
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Administration
                </h3>
                <div className="lg:hidden">
                  {expandedSections.admin ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>
              
              {(expandedSections.admin || !isMobileMenuOpen) && (
                <ul className="space-y-1 mt-2">
                  {adminMenuItems.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={getLinkClasses(link.href)}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <IconComponent 
                            size={20} 
                            className={isActiveLink(link.href) 
                              ? "text-blue-600 dark:text-blue-400" 
                              : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                            } 
                          />
                          <span className="flex-1">{link.label}</span>
                          {isActiveLink(link.href) && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <SearchProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Header />
          <Sidebar />
          
          {/* Contenu principal avec marge responsive */}
          <main className="lg:ml-64 mt-16 p-4 lg:p-6 min-h-screen">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 lg:p-6 min-h-[calc(100vh-8rem)]">
              {children}
            </div>
          </main>
        </div>
      </SearchProvider>
    </UserProvider>
  );
}