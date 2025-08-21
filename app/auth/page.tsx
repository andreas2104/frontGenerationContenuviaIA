"use client"; 
import React, { useState } from 'react';
import LoginForm from '../component/ui/auth/LoginForm'; 
import Link from 'next/link';
import RegisterForm from '../component/ui/auth/RegisterForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        {isLogin ? <LoginForm /> : <RegisterForm />}
        
        <p className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? (
            <>
              Pas encore de compte ?{' '}
              <button
                onClick={toggleForm}
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                S'inscrire
              </button>
            </>
          ) : (
            <>
              Déjà un compte ?{' '}
              <button
                onClick={toggleForm}
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Se connecter
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;