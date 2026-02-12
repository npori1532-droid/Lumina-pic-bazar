import React from 'react';
import { useSaved } from '../store/SavedContext';
import { PinCard } from './PinCard';
import { Pin } from '../types';
import { Trash2, Plus, Folder } from 'lucide-react';
import { motion } from 'framer-motion';

interface SavedViewProps {
  onPinClick: (pin: Pin) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({ onPinClick }) => {
  const { collections, activeCollectionId, setActiveCollectionId, createCollection, deleteCollection } = useSaved();
  const activeCollection = collections.find(c => c.id === activeCollectionId) || collections[0];

  const handleCreate = () => {
    const name = prompt("Collection Name:");
    if (name) createCollection(name);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this collection?")) deleteCollection(id);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar / Tabs */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">Collections</h2>
            <button onClick={handleCreate} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-gray-600 dark:text-white">
              <Plus size={20} />
            </button>
          </div>
          
          <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-2 pb-4 md:pb-0">
            {collections.map(col => (
              <button
                key={col.id}
                onClick={() => setActiveCollectionId(col.id)}
                className={`flex items-center justify-between p-3 rounded-lg text-left transition-all min-w-[150px] md:w-full ${
                  activeCollectionId === col.id 
                    ? 'bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white border border-gray-300 dark:border-white/20' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Folder size={18} className={activeCollectionId === col.id ? 'text-sky-500 dark:text-accent' : ''} />
                  <span className="truncate">{col.name}</span>
                </div>
                {col.id !== 'favorites' && (
                  <Trash2 
                    size={14} 
                    className="opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 ml-2"
                    onClick={(e) => { e.stopPropagation(); handleDelete(col.id); }} 
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-8 border-b border-gray-200 dark:border-white/10 pb-4">
            <h1 className="text-3xl font-display font-bold mb-2 text-gray-900 dark:text-white">{activeCollection?.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{activeCollection?.pins.length} items collected</p>
          </div>

          <div className="columns-2 md:columns-3 gap-6 space-y-6">
            {activeCollection?.pins.map(pin => (
               <PinCard key={pin.id} pin={pin} onClick={onPinClick} />
            ))}
          </div>
          
          {activeCollection?.pins.length === 0 && (
            <div className="py-20 text-center text-gray-500 dark:text-gray-500">
              <p>This collection is empty.</p>
              <p className="text-sm mt-2">Go explore and save some anime art!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};