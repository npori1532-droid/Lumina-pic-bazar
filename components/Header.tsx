import React, { useState } from 'react';
import { Search, Layers, Cpu, Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onSearch: (query: string) => void;
  onToggleView: (view: 'feed' | 'saved') => void;
  currentView: 'feed' | 'saved';
  onOpenProfile: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onToggleView, currentView, onOpenProfile, theme, onToggleTheme }) => {
  const [inputValue, setInputValue] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
    setIsMobileSearchOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 w-full transition-colors duration-300 bg-white/90 dark:bg-dark-950/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="max-w-[1800px] mx-auto px-2 sm:px-6 lg:px-8 h-16 md:h-24 flex items-center justify-between gap-2 md:gap-6">
          
          {/* BRANDING */}
          <div 
            className="flex flex-col cursor-pointer group select-none flex-shrink min-w-0"
            onClick={() => onToggleView('feed')}
          >
            <div className="flex items-center space-x-1.5 md:space-x-3 perspective-500">
              <div className="relative transform transition-transform duration-500 group-hover:rotate-y-180 flex-shrink-0">
                  <div className="absolute inset-0 bg-pink-500 blur-md opacity-40 animate-pulse"></div>
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/12310/12310639.png" 
                    alt="Logo" 
                    className="w-8 h-8 md:w-12 md:h-12 relative z-10 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                  />
              </div>
              <div className="flex flex-col min-w-0">
                  <span className="font-display font-black text-lg md:text-3xl tracking-tighter leading-none whitespace-nowrap drop-shadow-lg truncate">
                    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-400 to-sky-400 drop-shadow-[0_2px_0px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_0px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-300 animate-text" style={{ backgroundSize: '200% auto' }}>
                      LuminaPic
                    </span>
                  </span>
                  <span className="text-[7px] md:text-[10px] font-tech text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] mt-0.5 group-hover:text-sky-500 dark:group-hover:text-sky-300 transition-colors hidden sm:block">
                      Hacking • Art • Gallery
                  </span>
              </div>
            </div>
          </div>

          {/* DESKTOP SEARCH */}
          <form onSubmit={handleSubmit} className="hidden md:flex flex-1 max-w-2xl relative group perspective-500 mx-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Search className="h-5 w-5 text-gray-400 dark:text-sky-500/60 group-focus-within:text-sky-500 dark:group-focus-within:text-sky-400 transition-colors" />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              placeholder="Search hacking logos, vector art, anime dps..."
              className="block w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-dark-800/40 border border-gray-200 dark:border-white/10 rounded-xl leading-5 text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-dark-800 focus:border-sky-500 focus:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all duration-300 transform group-hover:scale-[1.01] shadow-inner"
            />
            <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-pink-500 via-yellow-400 to-sky-500 w-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
          </form>

          {/* NAVIGATION */}
          <nav className="flex items-center space-x-1 md:space-x-4 flex-shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 md:p-2.5 rounded-full bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-dark-700 transition-all border border-gray-200 dark:border-white/10"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} className="md:w-5 md:h-5" /> : <Moon size={18} className="text-purple-600 md:w-5 md:h-5" />}
            </button>

            {/* Mobile Search Toggle */}
            <button 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
            >
              <Search size={22} />
            </button>

            <button
              onClick={() => onToggleView(currentView === 'feed' ? 'saved' : 'feed')}
              className={`relative overflow-hidden flex items-center space-x-2 px-2 py-1.5 md:px-5 md:py-2.5 rounded-lg transition-all border ${
                currentView === 'saved' 
                  ? 'bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]' 
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <Layers size={20} className="md:w-5 md:h-5" />
              <span className="hidden lg:inline font-bold font-tech tracking-wider">SAVED</span>
            </button>
            
            {/* Developer Profile Button */}
            <button 
               onClick={onOpenProfile}
               className="flex items-center gap-2 pl-1 pr-1 md:pr-4 py-1 rounded-full bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-white/10 hover:border-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all group ml-1"
            >
               <div className="relative">
                 <div className="absolute inset-0 bg-pink-500 rounded-full blur opacity-20 group-hover:opacity-50 transition-opacity"></div>
                 <img 
                   src="https://www.gajarbotol.site/Tech_master/Tech_master_profile.jpg" 
                   alt="Tech Master" 
                   className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-white dark:border-dark-900 group-hover:border-pink-500 transition-colors relative z-10"
                   onError={(e) => { (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"; }}
                 />
                 <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-yellow-400 border-2 border-white dark:border-dark-900 rounded-full z-20"></div>
               </div>
               
               <div className="hidden xl:flex flex-col items-start text-left">
                 <span className="text-xs font-black text-gray-800 dark:text-white leading-none uppercase tracking-wide group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors">Tech Master</span>
                 <span className="text-[9px] text-gray-500 dark:text-gray-400 leading-none mt-1 font-tech uppercase tracking-[0.1em]">Admin</span>
               </div>
               
               <Cpu size={14} className="text-gray-400 dark:text-gray-600 group-hover:text-sky-500 dark:group-hover:text-sky-400 group-hover:rotate-90 transition-all duration-500 hidden md:block" />
            </button>
          </nav>
        </div>
      </motion.header>

      {/* MOBILE SEARCH OVERLAY */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden sticky top-16 z-30 bg-white/95 dark:bg-dark-950/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-sky-500/60 h-5 w-5" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  placeholder="Search..."
                  autoFocus
                  className="w-full bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50"
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};