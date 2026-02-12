import React, { createContext, useContext, useEffect, useState } from 'react';
import { Pin, Collection } from '../types';

interface SavedContextType {
  collections: Collection[];
  activeCollectionId: string;
  savePin: (pin: Pin, collectionId?: string) => void;
  removePin: (pinId: string, collectionId?: string) => void;
  createCollection: (name: string) => void;
  deleteCollection: (id: string) => void;
  isSaved: (pinId: string) => boolean;
  setActiveCollectionId: (id: string) => void;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

const DEFAULT_COLLECTION_ID = 'favorites';
const STORAGE_KEY = 'animotion_saved_v1';

export const SavedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collections, setCollections] = useState<Collection[]>([
    { id: DEFAULT_COLLECTION_ID, name: 'Favorites', pins: [] }
  ]);
  const [activeCollectionId, setActiveCollectionId] = useState(DEFAULT_COLLECTION_ID);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCollections(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved collections", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  }, [collections]);

  const savePin = (pin: Pin, collectionId: string = activeCollectionId) => {
    setCollections(prev => prev.map(col => {
      if (col.id === collectionId) {
        if (col.pins.some(p => p.id === pin.id)) return col; // Already saved
        return { ...col, pins: [pin, ...col.pins] };
      }
      return col;
    }));
  };

  const removePin = (pinId: string, collectionId: string = activeCollectionId) => {
    setCollections(prev => prev.map(col => {
      if (col.id === collectionId) {
        return { ...col, pins: col.pins.filter(p => p.id !== pinId) };
      }
      return col;
    }));
  };

  const createCollection = (name: string) => {
    const newCol: Collection = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      pins: []
    };
    setCollections(prev => [...prev, newCol]);
    setActiveCollectionId(newCol.id);
  };

  const deleteCollection = (id: string) => {
    if (id === DEFAULT_COLLECTION_ID) return; // Cannot delete default
    setCollections(prev => prev.filter(c => c.id !== id));
    if (activeCollectionId === id) setActiveCollectionId(DEFAULT_COLLECTION_ID);
  };

  const isSaved = (pinId: string) => {
    // Check if saved in ANY collection for the general indicator
    return collections.some(c => c.pins.some(p => p.id === pinId));
  };

  return (
    <SavedContext.Provider value={{
      collections,
      activeCollectionId,
      savePin,
      removePin,
      createCollection,
      deleteCollection,
      isSaved,
      setActiveCollectionId
    }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => {
  const context = useContext(SavedContext);
  if (!context) throw new Error("useSaved must be used within SavedProvider");
  return context;
};