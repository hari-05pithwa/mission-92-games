"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FerrisWheel, Layers, Type } from 'lucide-react';

const games = [
  { name: 'Round 1', path: '/wheel-spinner', icon: <FerrisWheel size={42} />, color: '#8b5cf6', bg: 'bg-purple-50' },
  { name: 'ROUND 2', path: '/reveal-word', icon: <Type size={42} />, color: '#10b981', bg: 'bg-green-50' },
  { name: 'ROUND 3', path: '/flip-card', icon: <Layers size={42} />, color: '#3b82f6', bg: 'bg-blue-50' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/20 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-16 flex flex-col items-center"
      >
        {/* Logo Container with Dark Red Background */}
        <div className="bg-[#8B0000] p-10 rounded-[3.5rem] shadow-[0_20px_50px_rgba(139,0,0,0.3)] border-4 border-white mb-6">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-32 md:h-44 w-auto object-contain brightness-110 contrast-110" 
          />
        </div>
        <div className="h-1.5 w-32 bg-[#8B0000] rounded-full opacity-20" />
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">
        {games.map((game, index) => (
          <Link href={game.path} key={game.path} className="group outline-none">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative aspect-square flex flex-col items-center justify-center rounded-[3.5rem] bg-white border border-slate-100 shadow-2xl transition-all duration-300"
            >
              <div className={`absolute inset-0 ${game.bg} opacity-0 group-hover:opacity-100 transition-opacity rounded-[3.5rem]`} />
              
              <div className="relative z-10 mb-6" style={{ color: game.color }}>
                {game.icon}
              </div>

              <h2 className="relative z-10 text-3xl font-black text-slate-800 tracking-tight uppercase">
                {game.name}
              </h2>

             
            </motion.div>
          </Link>
        ))}
      </div>
    </main>
  );
}