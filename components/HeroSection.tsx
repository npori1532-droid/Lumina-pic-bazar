import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Search } from 'lucide-react';

// Mock data for suggestions if API data isn't ready immediately
const SUGGESTIONS = [
  { id: 'h1', title: 'Cyber Skull', image: 'https://i.pinimg.com/736x/b2/89/3e/b2893e3518344df3c513df5d34c11818.jpg' },
  { id: 'h2', title: 'Neon Hacker', image: 'https://i.pinimg.com/736x/8b/6e/c6/8b6ec6060c5a16d506080352528148b8.jpg' },
  { id: 'h3', title: 'Glitch Anime', image: 'https://i.pinimg.com/736x/32/3d/8c/323d8c19958043598d9c57d079417933.jpg' },
  { id: 'h4', title: 'Future City', image: 'https://i.pinimg.com/736x/ea/15/43/ea1543b3978696b7972412611756570c.jpg' },
];

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  
  // Parallax effect on scroll
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const rotateX = useTransform(scrollY, [0, 300], [0, 15]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
      // Optional: scroll down to results
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-auto min-h-[300px] md:min-h-[400px] flex items-center justify-center overflow-hidden mb-6 perspective-1000 py-10 md:py-0">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent z-0" />
        
        <motion.div 
            style={{ y: y1, rotateX }}
            className="w-full max-w-7xl mx-auto px-6 z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        >
            {/* Text Content */}
            <div className="text-left space-y-3 md:space-y-4">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center space-x-2 text-pink-500 dark:text-pink-400"
                >
                    <Sparkles className="animate-pulse" />
                    <span className="font-tech tracking-[0.3em] uppercase text-xs md:text-sm font-bold">Tech Master Choice</span>
                </motion.div>
                
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                        opacity: 1, 
                        scale: 1,
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{ 
                        opacity: { duration: 0.8 },
                        scale: { duration: 0.8 },
                        backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
                    }}
                    style={{ backgroundSize: "200% auto" }}
                    className="text-4xl sm:text-5xl md:text-7xl font-display font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-sky-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)] dark:drop-shadow-[0_0_25px_rgba(236,72,153,0.5)]"
                >
                    LuminaPic <br/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-pink-500 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)] dark:drop-shadow-[0_0_25px_rgba(56,189,248,0.5)]">
                        Bazaar
                    </span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-base md:text-xl font-tech text-sky-600 dark:text-sky-400 font-bold"
                >
                    Developer Tech Master
                </motion.div>
                
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 dark:text-gray-400 font-tech text-xs md:text-base max-w-md border-l-2 border-pink-500 pl-4"
                >
                    Discover the ultimate collection of Hacking Photos, Vector Art, and 3D Anime aesthetics.
                </motion.p>

                {/* Search Bar */}
                <motion.form 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onSubmit={handleSubmit}
                  className="relative max-w-md mt-4 group"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-green-500/60 dark:text-green-400/80" />
                  </div>
                  {/* Updated Input with Green Glow Frame */}
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search for masterpieces..." 
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-800/80 border border-green-500/30 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                  />
                  {/* Updated Button with Green Glow Frame */}
                  <button 
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-4 bg-green-50 dark:bg-green-500/10 hover:bg-green-500 hover:text-white text-green-600 dark:text-green-400 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.8)]"
                  >
                    Search
                  </button>
                </motion.form>
            </div>

            {/* 3D Floating Cards (Suggestions) */}
            <div className="relative h-64 md:h-80 w-full perspective-1000 hidden md:block">
                {SUGGESTIONS.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 100, rotateY: 45 }}
                        animate={{ 
                            opacity: 1, 
                            x: index * 40, 
                            y: index * 20,
                            z: -index * 50,
                            rotateY: -15 
                        }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        whileHover={{ 
                            scale: 1.1, 
                            rotateY: 0, 
                            zIndex: 50,
                            boxShadow: "0 0 30px rgba(236, 72, 153, 0.5)" 
                        }}
                        className="absolute right-10 top-5 w-40 h-56 md:w-48 md:h-64 rounded-xl overflow-hidden border-2 border-white dark:border-white/10 bg-white dark:bg-dark-800 shadow-2xl origin-bottom-left cursor-pointer group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60" />
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute bottom-3 left-3 z-20">
                            <p className="text-white font-tech text-sm font-bold bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-pink-500/50">{item.title}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    </div>
  );
};