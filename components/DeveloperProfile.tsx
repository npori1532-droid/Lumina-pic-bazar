import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Youtube, Globe, MessageCircle, Send, Terminal, Facebook } from 'lucide-react';

interface DeveloperProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperProfile: React.FC<DeveloperProfileProps> = ({ isOpen, onClose }) => {
  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 perspective-1000">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-xl"
        />

        {/* 3D Entry Wrapper */}
        <motion.div
          initial={{ scale: 0.1, opacity: 0, rotateX: 90, y: 300 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0 }}
          exit={{ scale: 0.1, opacity: 0, rotateX: -90, y: 300 }}
          transition={{ type: "spring", damping: 12, stiffness: 150 }}
          className="relative w-full max-w-sm md:max-w-md z-[100000] preserve-3d"
        >
          {/* Floating Loop Wrapper */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="bg-dark-900/90 backdrop-blur-3xl border border-accent/50 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,243,255,0.3)] ring-1 ring-white/20 transform-style-3d"
          >
            {/* Holographic Header */}
            <div className="h-36 relative overflow-hidden shrink-0 group border-b border-accent/30">
               <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/26tn33aiTi1jbp6rn/giphy.gif')] opacity-30 bg-cover bg-center mix-blend-screen group-hover:opacity-50 transition-opacity duration-500" />
               <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-dark-900/95" />
               
               {/* Terminal Effect */}
               <div className="absolute top-4 left-4 font-mono text-[10px] md:text-xs text-green-400 opacity-90 font-bold tracking-wider leading-relaxed z-10 shadow-black drop-shadow-md">
                  &gt; INITIALIZING PROTOCOL...<br/>
                  &gt; TARGET: TECH_MASTER<br/>
                  &gt; STATUS: ONLINE
               </div>

               <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500 hover:text-white rounded-full text-white transition-all border border-white/20 backdrop-blur-md z-50 shadow-lg hover:rotate-90 duration-300">
                 <X size={20} />
               </button>
            </div>

            <div className="px-6 pb-8 relative -mt-20 flex-1">
              {/* Profile Pic with 3D Ring */}
              <div className="flex justify-center preserve-3d">
                <div className="relative group cursor-pointer hover:scale-105 transition-transform duration-500">
                  {/* Outer spinning rings */}
                  <div className="absolute inset-0 -m-3 rounded-full border-[3px] border-accent/40 border-t-transparent animate-[spin_4s_linear_infinite]"></div>
                  <div className="absolute inset-0 -m-3 rounded-full border-[3px] border-purple-500/40 border-b-transparent animate-[spin_4s_linear_infinite_reverse] rotate-45"></div>
                  
                  {/* Glow behind */}
                  <div className="absolute inset-0 rounded-full bg-accent/50 blur-2xl animate-pulse"></div>

                  <img 
                    src="https://www.gajarbotol.site/Tech_master/Tech_master_profile.jpg" 
                    alt="Tech Master"
                    className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-dark-900 object-cover relative z-10 shadow-[0_0_40px_rgba(0,243,255,0.6)]"
                    onError={(e) => {
                       (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"; 
                    }}
                  />
                  <div className="absolute bottom-2 right-2 z-20 w-8 h-8 bg-green-500 border-4 border-dark-900 rounded-full shadow-[0_0_15px_#00ff00]"></div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="inline-block px-4 py-1.5 mb-3 border border-accent/30 rounded-full bg-accent/10 backdrop-blur-md shadow-[0_0_20px_rgba(0,243,255,0.2)]">
                  <span className="text-accent text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                      <Terminal size={12} className="animate-pulse" /> System Admin
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-black text-white drop-shadow-[0_0_20px_rgba(0,243,255,0.6)] mb-2 uppercase tracking-tight">
                  Tech Master
                </h2>
                <p className="text-gray-300 font-tech tracking-[0.3em] text-xs md:text-sm uppercase mb-8 border-b border-white/10 pb-6 mx-4 md:mx-10">
                  Elite Full Stack Engineer
                </p>

                <div className="grid grid-cols-1 gap-3 text-sm">
                  <SocialButton 
                      href="https://www.facebook.com/share/1AV8aD9rGD/" 
                      icon={Facebook} 
                      label="Facebook" 
                      sub="Connect" 
                      color="text-blue-500" 
                      borderColor="hover:border-blue-500"
                  />
                  <SocialButton 
                      href="https://t.me/tech_master_a2z" 
                      icon={Send} 
                      label="Telegram Channel" 
                      sub="Updates" 
                      color="text-blue-400" 
                      borderColor="hover:border-blue-400"
                  />
                  <SocialButton 
                      href="https://t.me/GAJARBOTOLZ" 
                      icon={MessageCircle} 
                      label="Telegram Chat" 
                      sub="Discussion" 
                      color="text-indigo-400" 
                      borderColor="hover:border-indigo-400"
                  />
                  <SocialButton 
                      href="https://youtube.com/@masterjha2z720?si=ubrtKxyVN_Lo0VwB" 
                      icon={Youtube} 
                      label="YouTube" 
                      sub="Tutorials" 
                      color="text-red-500" 
                      borderColor="hover:border-red-500"
                  />
                  <SocialButton 
                      href="https://www.gajarbotol.site/" 
                      icon={Globe} 
                      label="Portfolio" 
                      sub="Projects" 
                      color="text-accent" 
                      borderColor="hover:border-accent"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

const SocialButton = ({ href, icon: Icon, label, sub, color, borderColor }: any) => (
    <a href={href} target="_blank" rel="noreferrer" 
        className={`flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 ${borderColor} rounded-xl transition-all duration-300 group hover:translate-x-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]`}
    >
        <div className="flex items-center space-x-4">
            <div className={`p-2 bg-black/40 rounded-lg ${color} group-hover:scale-125 transition-transform shadow-inner ring-1 ring-white/5`}>
                <Icon size={18} />
            </div>
            <div className="text-left">
                <div className="font-bold text-gray-100 text-sm group-hover:text-white group-hover:text-shadow-sm">{label}</div>
                <div className="text-[10px] md:text-xs text-gray-500 font-tech uppercase tracking-wider group-hover:text-accent transition-colors">{sub}</div>
            </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
            <span className="text-accent text-lg shadow-[0_0_10px_#00f3ff]">›</span>
        </div>
    </a>
);