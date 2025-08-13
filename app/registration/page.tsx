'use client'

import Link from "next/link";

export default function RegistrationPage() {
  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-gray-50 py-12 px-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md ">
        <h1 className="flex justify-center items-center text-sm text-blue-500">Inscription</h1>
        <form action="mt-8 space-y-6">
          <input type="hidden" name="remember"defaultValue="true" />

          <div className=" rounded-md shadow-sm space-y-4">
            {/* <div> */}
              <label htmlFor="nom"
              className="block text-sm shadow-sm font-medium text-blue-500"
              >Nom</label>
              <input type="text" 
              placeholder="Nom"
              className="mt-1 appearance-none block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline focus:ring-indigo-500 sm:text-sm"/>
            {/* </div> */}
            {/* <div> */}
              <label htmlFor="prenom"
              className="block text-sm shadow-sm font-medium text-blue-500"
              >Prenom</label>
              <input type="text" 
              placeholder="Prenom"
              className="mt-1 appearance-none block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline focus:ring-indigo-500 sm:text-sm"/>
            {/* </div> */}
            <div>
              <label htmlFor="email"
              className="block text-sm shadow-sm font-medium text-blue-500"
              >Email</label>
              <input type="text" 
              placeholder="Email"
              className="mt-1 appearance-none block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline focus:ring-indigo-500 sm:text-sm"/>
            </div>
            <div>
              <label htmlFor="password"
              className="block text-sm shadow-sm font-medium text-blue-500"
              >Mot de passe</label>
              <input type="password"
              className="mt-1 appearance-none block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="Role"
              className="block text-sm shadow-sm font-medium text-blue-500"
              >Role</label>
              <input type="text"
              className="mt-1 appearance-none block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>
          <div className="mt-5">
            <button
              type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent
                text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none
                focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed "
                >
              Enregistrer
            </button>
          </div>
          <div className="mt-3 text-sm">
            <Link href="/"
            className="font-medium text-indigo-600 hover:text-indigo-500">
            Annuler -{'>'}
            </Link>
          </div>
        </form>
          
      </div>
    </div>
  )
}
