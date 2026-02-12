import React from 'react';
import { motion } from 'framer-motion';
import { Code, Zap, Smile, Heart, User, Camera, Shield, Users } from 'lucide-react';

interface CategoryRailProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

// Updated Category List per request
const CATEGORIES = [
  { id: 'hacking logo', label: 'Hacking Logo', icon: Shield, color: 'text-green-600 dark:text-green-500' },
  { id: 'hacking photo', label: 'Hacking Photo', icon: Code, color: 'text-green-500 dark:text-green-400' },
  { id: 'vector art', label: 'Vector Art', icon: Zap, color: 'text-yellow-600 dark:text-yellow-400' },
  { id: 'cartoon pic', label: 'Cartoon Pic', icon: Smile, color: 'text-pink-500 dark:text-pink-400' },
  { id: 'social pic', label: 'Social Pic', icon: Users, color: 'text-blue-500 dark:text-blue-400' },
  { id: 'couple dp', label: 'Couple DP', icon: Heart, color: 'text-red-500 dark:text-red-500' },
  { id: 'cute girl', label: 'Cute Girl', icon: User, color: 'text-purple-500 dark:text-purple-400' },
  { id: 'dp', label: 'DP', icon: Camera, color: 'text-sky-500 dark:text-accent' },
];

export const CategoryRail: React.FC<CategoryRailProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 mb-10 mt-4 overflow-x-auto pb-6 pt-2 no-scrollbar perspective-500">
      <div className="flex space-x-4 min-w-max px-2">
        {CATEGORIES.map((cat, i) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;
          
          return (
            <motion.button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8, scale: 1.05, rotateX: 10 }}
              whileTap={{ scale: 0.95 }}
              className={`relative group h-14 min-w-[160px] pl-10 pr-6 flex items-center justify-center transition-all duration-300 preserve-3d ${
                isSelected ? 'z-10' : 'z-0'
              }`}
            >
              {/* Folder Shape Background with GREEN GLOW FRAME */}
              <div 
                className={`absolute inset-0 folder-shape border border-green-500/40 transition-all duration-300 backdrop-blur-md ${
                    isSelected 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 dark:from-dark-800/80 dark:to-dark-900/80 border-green-500 shadow-[0_0_15px_rgba(74,222,128,0.6)]' 
                    : 'bg-white/80 dark:bg-dark-800/40 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-500/20 shadow-[0_0_5px_rgba(74,222,128,0.2)] hover:shadow-[0_0_12px_rgba(74,222,128,0.5)]'
                }`}
              />
              
              {/* Glowing Green Tab Indicator */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${
                  isSelected ? 'bg-green-500 shadow-[0_0_15px_#4ade80]' : 'bg-gray-300 dark:bg-gray-700/50 group-hover:bg-green-400 group-hover:shadow-[0_0_10px_#4ade80]'
              }`} />

              <div className="relative z-10 flex items-center space-x-3 transform translate-z-10">
                <Icon size={18} className={`${isSelected ? cat.color : 'text-gray-500 dark:text-gray-500 group-hover:text-green-500'} transition-colors`} />
                <span className={`font-tech font-bold text-lg tracking-wide uppercase ${
                    isSelected ? 'text-white text-glow' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                }`}>
                  {cat.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};