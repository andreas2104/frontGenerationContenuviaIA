'use client'

import { useEffect, useState } from "react";
import AOS from "aos"
import "aos/dist/aos.css";
import Link from "next/link";

// Hook personnalisé pour l'effet typing
function useTypewriter(text: string, speed: number = 50) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  const reset = () => {
    setDisplayText('');
    setCurrentIndex(0);
  };

  return { displayText, reset, isComplete: currentIndex === text.length };
}

export default function HomePage() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const typingMessages = [
    "Création d'applications web modernes...",
    "Développement de solutions sur mesure...",
    "Optimisation de votre workflow digital...",
    "Prêt à concrétiser vos projets ! 🚀"
  ];

  const { displayText, reset } = useTypewriter(typingMessages[currentMessageIndex]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: 'ease-in-out',
    });
  }, []);

  useEffect(() => {
    if (currentMessageIndex < typingMessages.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentMessageIndex(prev => prev + 1);
        reset();
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [currentMessageIndex, typingMessages.length, reset]);

  return(
    <div className="min-h-screen flex flex-col">
    

      <section className="flex-1 relative flex flex-col items-center justify-center pt-20 pb-16 text-center overflow-hidden">

        <div data-aos='fade-down' data-aos-delay='300' className="absolute top-5 left-3">
          <span role="img" aria-label="lightbulb" className="text-6xl">💡</span>
        </div>
        
        <div data-aos="fade-down" data-aos-delay="500" className="absolute top-5 right-3">
          <span role="img" aria-label="rocket" className="text-8xl">🚀</span>
        </div>
        
        <div data-aos="zoom-in" data-aos-delay="700" className="absolute top-7 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl">
          <svg className="h-16 w-16 text-green-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.94 13.56a2 2 0 0 1-2.82 0l-1.07-1.07a2 2 0 0 1 0-2.82l1.07-1.07a2 2 0 0 1 2.82 0l1.07 1.07a2 2 0 0 1 0 2.82l-1.07 1.07z"/>
            <path d="M7.06 13.56a2 2 0 0 1 0-2.82l1.07-1.07a2 2 0 0 1 2.82 0l1.07 1.07a2 2 0 0 1 0 2.82l-1.07 1.07a2 2 0 0 1-2.82 0l-1.07-1.07z"/>
            <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <div className='relative z-10 w-full max-w-6xl mx-auto px-4'>
          <h1 data-aos="fade-up" data-aos-delay="1000" className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-5">
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400'>
              MEDIA TOWER
            </span>
            <br />
            <span className="text-white">YOUR CONTENT</span>
          </h1>
          
          <p data-aos="fade-up" data-aos-delay="1200" className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Transformez vos idées nos applications Assister par IA
          </p>


          <div data-aos="fade-up" data-aos-delay="1400" className="mb-12">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 max-w-4xl mx-auto">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">AI</span>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">Assistant M-Tech</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">En ligne</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-h-[60px] flex items-center">
                <div className="bg-gray-900/50 rounded-xl p-4 border border-blue-500/20 flex-1">
                  <p className="text-lg text-white font-mono">
                    {displayText}
                    <span className="ml-1 inline-block w-2 h-5 bg-blue-400 animate-pulse"></span>
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${((currentMessageIndex + 1) / typingMessages.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-gray-400 text-xs">
                      {currentMessageIndex + 1}/{typingMessages.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="1600" className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              className='px-8 py-4 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-transform hover:scale-105 flex items-center gap-2'
              href="/login"
            > 
              <span>🚀</span>
              Commencer maintenant
            </Link>
            
           <Link 
            href="/contact"
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-full font-semibold hover:bg-gray-800 transition-all"
                 >
                Nous contacter
                </Link>
          </div>

          {/* Stats rapides */}
          {/* <div data-aos="fade-up" data-aos-delay="1800" className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">50+</div>
              <div className="text-gray-400 text-sm">Projets réalisés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">24/7</div>
              <div className="text-gray-400 text-sm">Support IA</div>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <div className="text-2xl md:text-3xl font-bold text-white">100%</div>
              <div className="text-gray-400 text-sm">Satisfaction client</div>
            </div>
          </div> */}
        </div>
      </section>

    </div>
  )
}