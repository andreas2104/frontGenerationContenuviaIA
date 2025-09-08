'use client'
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow p-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </header>
      <div className='flex flex-1'>
            <aside className="w-64 bg-white dark:bg-gray-800 p-6 shadow-md transition-all duration-300">
        <nav className="space-y-4">
          <h2 className="text-xl font-bold">Table Bord</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                <span className="font-medium">Home</span>
              </Link>
            </li>
            <li>
              <Link href="/projet" className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                <span className="font-medium">Student</span>
              </Link>
            </li>
            <li>
              <Link href="/prompt" className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                <span className="font-medium">Fees</span>
              </Link>
            </li>
            <li>
              <Link href="/modelIA" className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                <span className="font-medium">Payements</span>
              </Link>
            </li>
            <li>
              <Link href="/template" className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                <span className="font-medium">Center</span>
              </Link>
            </li>
            <li>
              <Link href="/generer" className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                <span className="font-medium">Center</span>
              </Link>
            </li>
              <li>
              <Link href="/historique" className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                <span className="font-medium">Center</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="p-6">
        {children}
      </main>
      </div>
    </div>
  );
}