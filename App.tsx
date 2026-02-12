import React, { useState, useEffect, useCallback } from 'react';
import { SavedProvider } from './store/SavedContext';
import { Background3D } from './components/Background3D';
import { Header } from './components/Header';
import { MasonryGrid } from './components/MasonryGrid';
import { SavedView } from './components/SavedView';
import { PinModal } from './components/PinModal';
import { fetchPins } from './services/api';
import { useDebounce } from './hooks/useDebounce';
import { Pin } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { DeveloperProfile } from './components/DeveloperProfile';
import { CategoryRail } from './components/CategoryRail';
import { HeroSection } from './components/HeroSection';
import { SuggestionsRail } from './components/SuggestionsRail';

function App() {
  const [view, setView] = useState<'feed' | 'saved'>('feed');
  const [searchQuery, setSearchQuery] = useState(''); 
  const [activeCategory, setActiveCategory] = useState('hacking logo'); 
  const debouncedQuery = useDebounce(searchQuery, 600);
  
  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [loading, setLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // --- SMART SUGGESTION STATE ---
  const [suggestedPins, setSuggestedPins] = useState<Pin[]>([]);
  const [userInterest, setUserInterest] = useState<string>('hacking-logo');

  // Initialize Theme
  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('lumina_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('dark'); // Default to dark as requested
    }
  }, []);

  // Apply Theme to HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('lumina_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Handle PWA Shortcuts via URL Params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setActiveCategory(categoryParam);
      window.history.replaceState({}, '', window.location.pathname);
    }
    
    const storedInterest = localStorage.getItem('lumina_interest');
    if (storedInterest) {
        setUserInterest(storedInterest);
    }
  }, []);

  const updateUserInterest = (interest: string) => {
    localStorage.setItem('lumina_interest', interest);
    setUserInterest(interest);
  };

  useEffect(() => {
    const loadSuggestions = async () => {
        if (!userInterest) return;
        if (userInterest === activeCategory && !searchQuery) return;
        
        try {
            const data = await fetchPins(userInterest);
            setSuggestedPins(data.slice(0, 8));
        } catch (e) {
            console.error("Failed to load suggestions");
        }
    };
    loadSuggestions();
  }, [userInterest, activeCategory, searchQuery]);

  useEffect(() => {
    const loadPins = async () => {
      setLoading(true);
      const queryToFetch = debouncedQuery.trim() ? debouncedQuery : activeCategory;
      
      if (debouncedQuery.trim()) {
        updateUserInterest(debouncedQuery.trim());
      } else {
        updateUserInterest(activeCategory);
      }

      const data = await fetchPins(queryToFetch);
      setPins(data.sort(() => Math.random() - 0.5));
      setLoading(false);
    };

    loadPins();
  }, [debouncedQuery, activeCategory]);

  return (
    <SavedProvider>
      {/* Main Wrapper with Theme Transition */}
      <div className="min-h-screen transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-dark-950 dark:text-white font-sans selection:bg-accent selection:text-black overflow-x-hidden">
        
        {/* 3D Particles Background - Only visible in Dark Mode effectively, or adjusted for Light */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20 dark:opacity-100 transition-opacity duration-500">
           <Background3D />
        </div>
        
        <Header 
          onSearch={setSearchQuery} 
          onToggleView={setView} 
          currentView={view}
          onOpenProfile={() => setIsProfileOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="relative z-10 pt-4">
          <AnimatePresence mode="wait">
            {view === 'feed' ? (
              <motion.div
                key="feed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {!searchQuery && <HeroSection onSearch={setSearchQuery} />}

                <div className="sticky top-20 md:top-24 z-30 backdrop-blur-sm pt-2">
                    <CategoryRail 
                        selectedCategory={activeCategory} 
                        onSelectCategory={(id) => {
                        setSearchQuery(''); 
                        setActiveCategory(id);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                        }} 
                    />
                </div>

                {!loading && suggestedPins.length > 0 && userInterest !== activeCategory && !searchQuery && (
                    <SuggestionsRail 
                        pins={suggestedPins} 
                        onPinClick={setSelectedPin} 
                        topic={userInterest}
                    />
                )}

                <MasonryGrid pins={pins} onPinClick={setSelectedPin} />
              </motion.div>
            ) : (
              <motion.div
                key="saved"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4 }}
              >
                <SavedView onPinClick={setSelectedPin} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <PinModal 
          pin={selectedPin} 
          onClose={() => setSelectedPin(null)} 
        />
        
        <DeveloperProfile 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
        />
        
        <AnimatePresence>
          {loading && pins.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-dark-950/90 backdrop-blur-xl"
            >
               <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24">
                     <div className="absolute inset-0 border-4 border-accent/30 rounded-full animate-ping"></div>
                     <div className="absolute inset-2 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                     <div className="absolute inset-4 border-4 border-purple-500 border-b-transparent rounded-full animate-spin-reverse"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-tech text-xs text-accent animate-pulse">LOADING</span>
                     </div>
                  </div>
                  <p className="mt-6 font-tech text-accent tracking-[0.5em] uppercase text-sm animate-glitch">
                    System Override...
                  </p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SavedProvider>
  );
}

export default App;