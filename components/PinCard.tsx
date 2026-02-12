import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Pin } from '../types';
import { Heart, Download } from 'lucide-react';
import { useSaved } from '../store/SavedContext';

interface PinCardProps {
  pin: Pin;
  onClick: (pin: Pin) => void;
}

export const PinCard: React.FC<PinCardProps> = ({ pin, onClick }) => {
  const { isSaved, savePin, removePin } = useSaved();
  const saved = isSaved(pin.id);

  // Advanced 3D Tilt Logic
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Stiffer spring for more responsive feel
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 10 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 10 });

  // Increased tilt range for more drama
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);
  const brightness = useTransform(mouseYSpring, [-0.5, 0.5], [1.3, 0.7]);
  const translateZ = useTransform(mouseYSpring, [-0.5, 0.5], ["20px", "50px"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    saved ? removePin(pin.id) : savePin(pin);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "100px" }}
      style={{ 
        rotateX, 
        rotateY, 
        z: translateZ,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mb-8 break-inside-avoid group cursor-pointer perspective-1000 z-0 hover:z-50"
      onClick={() => onClick(pin)}
    >
      <motion.div 
        style={{ filter: useTransform(brightness, b => `brightness(${b})`) }}
        className="relative rounded-xl transition-all duration-300 transform-gpu shadow-xl"
      >
        {/* ANIMATED RGB BORDER (Pink, Red, Blue) - Outer Spinning Border */}
        <div className="absolute -inset-[2px] rounded-xl bg-[conic-gradient(from_0deg,#ec4899,#ef4444,#3b82f6,#ec4899)] animate-[spin_4s_linear_infinite] opacity-80 group-hover:opacity-100 transition-opacity z-0 blur-[1px]" />
        
        {/* Inner Content Container (Masks the center of the gradient) */}
        <div className="relative z-10 rounded-[10px] bg-white dark:bg-dark-800 overflow-hidden h-full w-full">
            
            {/* FIXED THIN FRAME (Pink, Red, Blue) - Inner Static Border */}
            {/* This creates a 1px fixed gradient border on top of the image content */}
            <div 
              className="absolute inset-0 z-20 pointer-events-none rounded-[10px] border-[1px] border-transparent opacity-90"
              style={{ 
                background: 'linear-gradient(135deg, #ec4899, #ef4444, #3b82f6) border-box',
                WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude'
              }}
            />

            {/* Holographic Sheen Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 z-30 pointer-events-none mix-blend-overlay transition-opacity duration-300" />
            
            {/* Animated Scanline Overlay - Dark mode only */}
            <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/26tn33aiTi1jbp6rn/giphy.gif')] opacity-0 dark:group-hover:opacity-10 mix-blend-screen pointer-events-none z-20" />

            {/* Image */}
            <img
            src={pin.image}
            alt={pin.title}
            loading="lazy"
            className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-110 will-change-transform"
            />

            {/* Badges */}
            {pin.isGif && (
            <div className="absolute top-3 left-3 z-30 px-2 py-0.5 bg-black/80 backdrop-blur-md rounded border border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.4)]">
                <span className="text-[10px] font-black text-pink-500 font-tech tracking-widest animate-pulse">GIF</span>
            </div>
            )}

            {/* Floating Content Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 flex flex-col justify-end p-4 transform translate-z-20">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-display font-bold text-lg leading-tight line-clamp-1 text-glow">
                {pin.title}
                </h3>
                
                <div className="flex items-center justify-between mt-3">
                <span className="text-gray-300 text-xs font-tech tracking-wider uppercase">
                    {pin.uploader?.username || "Tech Master"}
                </span>
                
                <div className="flex space-x-2">
                    <button
                        onClick={handleDownload}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-md border border-white/10 hover:border-sky-400 hover:text-sky-400"
                        title="Download"
                    >
                        <Download size={14} />
                    </button>
                    <button
                        onClick={handleSave}
                        className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${
                        saved 
                            ? 'bg-red-500 text-white border-red-500 shadow-[0_0_10px_#ef4444]' 
                            : 'bg-white/10 text-yellow-400 border-white/20 hover:bg-yellow-400 hover:text-black hover:border-yellow-400'
                        }`}
                    >
                        <Heart size={14} fill={saved ? "currentColor" : "none"} />
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};