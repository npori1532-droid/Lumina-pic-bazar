import React from 'react';
import { Pin } from '../types';
import { PinCard } from './PinCard';
import { motion } from 'framer-motion';

interface MasonryGridProps {
  pins: Pin[];
  onPinClick: (pin: Pin) => void;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ pins, onPinClick }) => {
  if (pins.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="w-full h-96 flex flex-col items-center justify-center text-gray-500"
      >
        <div className="w-16 h-16 mb-4 rounded-full border-2 border-dashed border-accent animate-spin-slow opacity-50" />
        <p className="text-xl font-display text-accent">No artifacts found.</p>
        <p className="text-sm opacity-50 font-tech uppercase tracking-widest mt-2">Execute different query protocol.</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 pb-20 max-w-[1800px] mx-auto">
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-6">
        {pins.map((pin) => (
          <PinCard key={pin.id} pin={pin} onClick={onPinClick} />
        ))}
      </div>
      
      {/* Loading Indicator / Infinite Scroll Placeholder */}
      <div className="w-full flex justify-center py-20 opacity-50">
         <div className="relative">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-10 h-10 border-4 border-purple-500 border-b-transparent rounded-full animate-spin-reverse opacity-50"></div>
         </div>
      </div>
    </div>
  );
};