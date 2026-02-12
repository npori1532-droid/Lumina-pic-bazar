import React from 'react';
import { motion } from 'framer-motion';
import { Pin } from '../types';
import { Sparkles, Brain } from 'lucide-react';

interface SuggestionsRailProps {
  pins: Pin[];
  onPinClick: (pin: Pin) => void;
  topic: string;
}

export const SuggestionsRail: React.FC<SuggestionsRailProps> = ({ pins, onPinClick, topic }) => {
  if (!pins || pins.length === 0) return null;

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 mb-8 mt-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-1.5 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-lg animate-pulse">
            <Brain size={16} className="text-white" />
        </div>
        <h2 className="text-lg font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
          Because you like <span className="uppercase text-white underline decoration-accent/50 decoration-2">{topic.replace('-', ' ')}</span>
        </h2>
      </div>

      <div className="overflow-x-auto pb-6 no-scrollbar">
        <div className="flex space-x-4 min-w-max">
          {pins.map((pin, i) => (
            <motion.div
              key={`sug-${pin.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => onPinClick(pin)}
              className="relative w-40 h-56 md:w-48 md:h-64 rounded-xl overflow-hidden cursor-pointer group border border-white/10 hover:border-accent/50 transition-colors shadow-lg"
            >
              <div className="absolute inset-0 bg-dark-900 animate-pulse" />
              <img 
                src={pin.image} 
                alt={pin.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs font-bold text-white truncate">{pin.title}</p>
                <div className="flex items-center text-[10px] text-accent mt-1">
                   <Sparkles size={10} className="mr-1" /> Recommended
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};