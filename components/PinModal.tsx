import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Pin } from '../types';
import { X, Heart, ExternalLink, Download, Share2, User } from 'lucide-react';
import { useSaved } from '../store/SavedContext';

interface PinModalProps {
  pin: Pin | null;
  onClose: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({ pin, onClose }) => {
  const { isSaved, savePin, removePin } = useSaved();
  
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (pin) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [pin]);

  if (!pin) return null;

  const saved = isSaved(pin.id);

  const toggleSave = () => {
    if (saved) removePin(pin.id);
    else savePin(pin);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Helper function to trigger download from blob
    const downloadBlob = (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const ext = pin.image.split('.').pop()?.split(/[#?]/)[0] || 'jpg';
    const filename = `${pin.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_LuminaPic.${ext}`;

    try {
        // Attempt 1: Direct Fetch
        const response = await fetch(pin.image);
        if (!response.ok) throw new Error("Direct fetch failed");
        const blob = await response.blob();
        downloadBlob(blob, filename);
    } catch (err) {
        console.warn("Direct download failed, trying proxy...", err);
        try {
            // Attempt 2: CORS Proxy
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(pin.image)}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error("Proxy fetch failed");
            const blob = await response.blob();
            downloadBlob(blob, filename);
        } catch (proxyErr) {
            console.error("All download attempts failed, opening in new tab", proxyErr);
            // Fallback: Open in new tab if everything fails
            window.open(pin.image, '_blank');
        }
    }
  };

  // Use Portal to render outside of any transformed parent
  return createPortal(
    <AnimatePresence>
      {pin && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-hidden perspective-2000">
          {/* Backdrop with heavy blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 dark:bg-black/95 backdrop-blur-xl"
          />

          {/* Modal Card with High-Impact 3D Entry */}
          <motion.div
            layoutId={`pin-${pin.id}`}
            initial={{ opacity: 0, scale: 0.2, z: -500, rotateX: 45 }} 
            animate={{ opacity: 1, scale: 1, z: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.2, z: -500, rotateX: -45 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-5xl h-auto max-h-[85vh] md:max-h-[80vh] bg-white dark:bg-dark-900/90 backdrop-blur-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.2)] dark:shadow-[0_0_100px_rgba(0,243,255,0.4)] border border-gray-200 dark:border-accent/40 z-[100000] preserve-3d"
          >
            {/* Holographic Border Shine - Dark Mode */}
            <div className="absolute inset-0 z-50 pointer-events-none rounded-3xl border border-white/10 shadow-[inset_0_0_30px_rgba(255,255,255,0.05)] hidden dark:block"></div>
            
            {/* Neon Border Lines - Dark Mode */}
            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_30px_#00f3ff] z-50 hidden dark:block"></div>
            <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_30px_#bc13fe] z-50 hidden dark:block"></div>

            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-[60] p-2.5 bg-white/80 dark:bg-black/50 hover:bg-red-500 hover:text-white rounded-full text-gray-800 dark:text-white backdrop-blur-md border border-gray-300 dark:border-white/20 transition-all hover:scale-110 hover:rotate-90 shadow-lg group"
            >
              <X size={22} className="group-hover:animate-pulse" />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-1/2 lg:w-3/5 bg-gray-100 dark:bg-black/80 flex items-center justify-center overflow-hidden relative group p-4 md:p-0">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 dark:to-dark-950/90 z-10"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent opacity-60 animate-pulse hidden dark:block"></div>
              
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                src={pin.image}
                alt={pin.title}
                className="w-full h-full object-contain relative z-20 drop-shadow-xl dark:drop-shadow-[0_0_50px_rgba(0,243,255,0.3)] transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Details Section */}
            <div className="w-full md:w-1/2 lg:w-2/5 p-6 md:p-8 flex flex-col overflow-y-auto custom-scrollbar text-gray-900 dark:text-white relative bg-white dark:bg-dark-800/80">
               {/* 3D Grid Overlay - Dark Mode */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50 hidden dark:block"></div>

              <div className="flex items-center justify-between mb-6 relative z-10">
                 <div className="flex space-x-3">
                   <button 
                    onClick={copyLink}
                    className="p-3 bg-gray-100 dark:bg-white/5 hover:bg-accent/20 text-gray-600 dark:text-gray-300 hover:text-accent rounded-xl transition-all border border-gray-200 dark:border-white/10 hover:border-accent/50 group"
                    title="Copy Link"
                   >
                     <Share2 size={20} className="group-hover:scale-110 transition-transform" />
                   </button>
                   <button
                     onClick={handleDownload}
                     className="p-3 bg-gray-100 dark:bg-white/5 hover:bg-accent/20 text-gray-600 dark:text-gray-300 hover:text-accent rounded-xl transition-all border border-gray-200 dark:border-white/10 hover:border-accent/50 group"
                     title="Download Image"
                   >
                     <Download size={20} className="group-hover:scale-110 transition-transform" />
                   </button>
                 </div>
                 <button
                   onClick={toggleSave}
                   className={`px-6 py-2.5 rounded-xl font-bold font-tech uppercase tracking-wider transition-all transform active:scale-95 shadow-md border ${
                     saved 
                     ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                     : 'bg-white dark:bg-transparent bg-gradient-to-r from-gray-100 to-gray-200 dark:from-accent/20 dark:to-blue-500/20 hover:bg-gray-200 dark:hover:bg-accent/30 text-gray-800 dark:text-accent border-gray-300 dark:border-accent'
                   }`}
                 >
                   {saved ? 'Saved' : 'Save'}
                 </button>
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-black mb-4 leading-tight text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-gray-200 dark:to-gray-400 drop-shadow-sm dark:drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] relative z-10">
                {pin.title || "Untitled Art"}
              </h1>

              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-8 flex-grow relative z-10 font-tech tracking-wide border-l-2 border-pink-500 dark:border-accent/30 pl-4">
                {pin.description || "No description provided for this artwork. Enjoy the visuals."}
              </p>

              {/* Uploader Profile */}
              <div className="mt-auto pt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3 group cursor-pointer">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent to-purple-600 p-[2px] shadow-lg dark:shadow-[0_0_15px_rgba(0,243,255,0.3)] group-hover:shadow-xl transition-shadow">
                     <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center text-gray-800 dark:text-white font-bold text-lg">
                        {pin.uploader?.username?.[0]?.toUpperCase() || <User size={20} />}
                     </div>
                   </div>
                   <div>
                     <p className="font-bold text-gray-900 dark:text-white group-hover:text-pink-500 dark:group-hover:text-accent transition-colors">{pin.uploader?.full_name || "Unknown Artist"}</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">@{pin.uploader?.username}</p>
                   </div>
                </div>
                <a
                  href={pin.pin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-accent text-black font-bold rounded-xl text-sm transition-all hover:bg-white hover:shadow-lg flex items-center space-x-2"
                >
                  <span>Visit</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};