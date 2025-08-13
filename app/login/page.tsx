'use client'

import Link from "next/link"


export default function LoginPage() {
  return(
    <div className="flex w-full min-h-screen justify-center items-center bg-gray-50 py-12 px-12 sm:px-6 lg:px-8">       
      <div className="max-w-md w-full space-y-8 bg-white p-8  rounded-lg shadow-md">
        <h1 className="flex justify-center items-center text-sm text-blue-500">Connexion</h1>

          <form action="mt-8 space-y-6">
            <input type="hidden" name="remember" defaultValue="true"/>
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-500"
                  	htmlFor="email"
                    >Email</label>                 
                  <input className="mt-1 appearance-none block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline focus:ring-indigo-500 sm:text-sm "
                    type="text"
                    id="email"
                    autoComplete="email" 
                    placeholder="email"/>                
                </div>
                <div>
                    <label className="block text-sm font-medium text-blue-500"
                    >Mot de passe</label>
                    <input 
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required 
                    placeholder="mot de passe" 
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300  rounder-md shadow-sm  placeholder-gray-400 focus:outline focus:ring-indigo-500 sm:text-sm"/>
                 </div>
                 <div>
                    <input
                     type="checkbox"
                     name="remember-me"
                      id="remember-me"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900">
                        Remember-me
                      </label>
                 </div>
                 <div className="text-sm">
                   <Link href="/"
                   className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot Password ?
                   </Link>
                </div>
              </div>      

              <div>
              	<button
                type="submit"
                className=" group relative w-full flex justify-center py-2 px-4 border border-transparent
                text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none
                focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed "
                >
                	<>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                    Connecter
                  </>
                </button>
              </div>
        	</form>
      </div>
     </div>
  )
}
