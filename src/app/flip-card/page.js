"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import confetti from "canvas-confetti";

// Filtered to show only 1, 3, and 4
const CARDS = [
  { id: 1, img: "/images/01 Vachanamrut.png", label: "01", color: "bg-[#FF6B6B]" },
  { id: 2, img: "/images/03 Divy_bhav.png", label: "02", color: "bg-[#4D96FF]" },
  { id: 3, img: "/images/04 Ghar_sabha.png", label: "03", color: "bg-[#9B59B6]" },
];

const ANSWERS = {
  1: "स्वसंप्रदायग्रन्थानां यथाशक्ति यथारुचि। संस्कृते प्राकृते वाऽपि कुर्यात् पठनपाठने॥ २३५॥",
  2: "सत्सङ्गिषु सुहृद्भावो दिव्यभावस्तथैव च। अक्षरब्रह्मभावश्च विधातव्यो मुमुक्षुणा॥ १४०॥",
  3: "संभूय प्रत्यहं कार्या गृहसभा गृहस्थितैः। कर्तव्यं भजनं गोष्ठिः शास्त्रपाठादि तत्र च॥ ८६॥",
};

export default function PlayfulRevealPage() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [openedIds, setOpenedIds] = useState(new Set());
  const requestRef = useRef(null);

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      confetti.reset();
    };
  }, []);

  const triggerCelebration = () => {
    const end = Date.now() + 1500;
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.8 }, colors: ["#FF6B6B", "#4D96FF", "#9B59B6"] });
      confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.8 }, colors: ["#FF6B6B", "#4D96FF", "#9B59B6"] });
      if (Date.now() < end) requestRef.current = requestAnimationFrame(frame);
    };
    frame();
  };

  const handleSelectCard = (card) => {
    if (openedIds.has(card.id)) return;
    setSelectedCard(card);
    setShowAnswer(false);
    setOpenedIds((prev) => new Set(prev).add(card.id));
  };

  const handleDoubleClick = () => {
    if (!showAnswer) {
      setShowAnswer(true);
      triggerCelebration();
    }
  };

  const handleExit = () => {
    if (showAnswer) {
      setSelectedCard(null);
      confetti.reset();
    }
  };

  const formatShlok = (text) => {
    if (!text) return null;
    const parts = text.split(/(?<=[।])/);
    return (
      <div className="flex flex-col gap-2 font-sanskrit">
        {parts.map((line, index) => (
          <span key={index} className="block whitespace-nowrap">
            {line.trim()}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="h-screen w-screen bg-[#FFFDF0] flex flex-col items-center overflow-hidden p-12 relative font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-yellow-200/30 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-blue-200/30 blur-[100px] rounded-full" />
      </div>

      <nav className="relative w-full flex justify-center items-center mt-4 mb-20 z-20">
        <div className="flex flex-col items-center max-w-fit">
          <h1 className="text-5xl font-black text-slate-800 tracking-tight flex items-center gap-4 italic uppercase">
            ROUND 3
          </h1>
          <div className="h-3 w-full bg-blue-400 rounded-full mt-3 border-2 border-slate-800 shadow-[3px_3px_0px_#1e3a8a]" />
        </div>
      </nav>

      {/* Grid centered for 3 items */}
      <div className="flex-1 w-full max-w-4xl grid grid-cols-3 gap-12 items-center px-4">
        {CARDS.map((card, index) => {
          const isOpened = openedIds.has(card.id);
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!isOpened ? { y: -15, rotate: index % 2 === 0 ? 3 : -3 } : {}}
              whileTap={!isOpened ? { scale: 0.98 } : {}}
              onClick={() => handleSelectCard(card)}
              className={`aspect-[3/4.5] rounded-[3rem] border-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden transition-all duration-500
                ${isOpened ? "bg-slate-200 border-slate-300 grayscale" : `${card.color} border-white`}
              `}
            >
              <span className={`text-9xl font-black italic mb-2 relative z-10 select-none transition-all duration-300
                ${isOpened ? "text-slate-300 opacity-20 scale-75" : "text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)] group-hover:scale-110"}
              `}>
                {card.label}
              </span>
              {!isOpened ? (
                <div className="bg-white px-6 py-2.5 rounded-2xl shadow-md relative z-10 border-2 border-slate-100">
                  <p className="text-sm font-black text-slate-700 uppercase tracking-widest">Open!</p>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <X className="text-slate-400 opacity-60" size={100} strokeWidth={4} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedCard && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleExit}
              className="absolute inset-0 bg-blue-900/20 backdrop-blur-[30px]"
            />

            <motion.div
              onDoubleClick={handleDoubleClick}
              initial={{ opacity: 0, scale: 0, rotateY: 90, z: -500 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
              exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
              transition={{ type: "spring", damping: 15, stiffness: 90 }}
              className={`relative w-full max-w-6xl max-h-[85vh] aspect-video bg-white rounded-[4rem] shadow-[0_60px_100px_-30px_rgba(0,0,0,0.2)] border-[20px] border-white overflow-hidden z-10 flex flex-col items-center justify-center select-none ${showAnswer ? 'cursor-pointer' : 'cursor-help'}`}
              onClick={handleExit}
            >
              {showAnswer && (
                <button
                  onClick={handleExit}
                  className="absolute top-8 right-8 z-50 p-4 bg-red-500 text-white rounded-full shadow-lg border-4 border-white active:scale-90"
                >
                  <X size={32} strokeWidth={4} />
                </button>
              )}

              <div className="w-full h-full flex flex-col items-center justify-center p-12 pointer-events-none">
                <AnimatePresence mode="wait">
                  {!showAnswer ? (
                    <motion.img
                      key="image"
                      layoutId={`img-${selectedCard.id}`}
                      src={selectedCard.img}
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)", transition: { duration: 0.3 } }}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <motion.div
                      key="answer"
                      initial={{ opacity: 0, rotateX: -90, scale: 0.9 }}
                      animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                      transition={{ type: "spring", damping: 15, stiffness: 100 }}
                      className="w-full"
                    >
                       <div className="bg-white border-4 border-slate-100 p-12 rounded-[3rem] shadow-xl w-full">
                          <div className="font-bold text-slate-800 text-center leading-[1.6]"
                               style={{ fontSize: 'min(3.5vw, 52px)' }}>
                            {formatShlok(ANSWERS[selectedCard.id])}
                          </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
             
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}