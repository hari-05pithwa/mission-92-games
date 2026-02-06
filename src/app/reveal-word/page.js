"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Unlock } from "lucide-react";
import confetti from "canvas-confetti";

// The specific Shlok numbers to reveal inside the first popup
const SHLOK_NUMBERS = ["10", "61", "153", "204"];

// Updated Shlok text for perfect 2-line formatting
const ANSWERS = {
  0: "दीक्षेति दृढसङ्कल्पः सश्रद्धं निश्चयोऽचलः। सम्यक् समर्पणं प्रीत्या निष्ठा व्रतं दृढाश्रयः॥ १०॥",
  1: "मध्ये तु स्थापयेत्तत्र ह्यक्षरपुरुषोत्तमौ। स्वामिनं हि गुणातीतं महाराजं च तत्परम्॥ ६१॥",
  2: "प्रार्थनं प्रत्यहं कुर्याद् विश्वासभक्तिभावतः। गुरोर्ब्रह्मस्वरूपस्य स्वामिनारायणप्रभोः॥ १५३॥",
  3: "शक्या भगवतो यत्र भक्तिः स्वधर्मपालनम्। तस्मिन् देशे निवासो हि करणीयः सुखेन च॥ २०४॥",
};

const COLORS = ["#FF6B6B", "#4D96FF", "#9B59B6", "#6BCB77"];

export default function LockedBoxReveal() {
  const [activeItem, setActiveItem] = useState(null);
  const [showShlok, setShowShlok] = useState(false);
  const [unlockedIds, setUnlockedIds] = useState(new Set());
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
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: COLORS,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: COLORS,
      });
      if (Date.now() < end) requestRef.current = requestAnimationFrame(frame);
    };
    frame();
  };

  const handleBoxClick = (shlokNum, index) => {
    if (unlockedIds.has(index)) return;
    setActiveItem({ shlokNum, index });
    setShowShlok(false);
  };

  const handleDoubleClick = () => {
    if (activeItem && !showShlok) {
      setShowShlok(true);
      setUnlockedIds((prev) => new Set(prev).add(activeItem.index));
      triggerCelebration();
    }
  };

  const handleExit = () => {
    if (showShlok) {
      setActiveItem(null);
      setShowShlok(false);
      confetti.reset();
    }
  };

  // Modified to force exactly 2 lines
  const formatShlok = (text) => {
    if (!text) return null;
    // Split specifically at the first । to separate the two lines
    const parts = text.split(/(?<=।)/);

    return (
      <div className="flex flex-col gap-6 font-sanskrit">
        {parts.map((line, index) => (
          <span key={index} className="block leading-tight whitespace-normal">
            {line.trim()}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="h-screen w-screen bg-[#FFFDF0] flex flex-col items-center overflow-hidden p-12 relative font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-yellow-200/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-blue-200/40 blur-[100px] rounded-full" />
      </div>

      <nav className="relative w-full flex justify-center items-center mt-4 mb-20 z-20">
        <div className="flex flex-col items-center max-w-fit">
          <h1 className="text-5xl font-black text-slate-800 tracking-tight flex items-center gap-4 italic uppercase">
            ROUND 2
          </h1>
          <div className="h-3 w-full bg-blue-400 rounded-full mt-3 border-2 border-slate-800 shadow-[3px_3px_0px_#1e3a8a]" />
        </div>
      </nav>

      <div className="flex-1 w-full max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-12 items-center justify-items-center mb-10 px-10">
        {SHLOK_NUMBERS.map((shlokNum, index) => {
          const isOpened = unlockedIds.has(index);
          return (
            <motion.div
              key={index}
              whileHover={!isOpened ? { y: -10, scale: 1.02 } : {}}
              onClick={() => handleBoxClick(shlokNum, index)}
              className={`group relative w-[240px] aspect-square rounded-[2.5rem] border-[12px] border-white shadow-2xl overflow-hidden flex flex-col items-center justify-center transition-all duration-500 cursor-pointer h-[240px]
                ${isOpened ? "bg-slate-200 grayscale" : "bg-slate-800"}
              `}
            >
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 border-b border-white/10" />
              <AnimatePresence mode="wait">
                {isOpened ? (
                  <motion.div
                    key="unlocked"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <Unlock size={64} className="text-slate-400 mb-2" />
                    <span className="text-slate-400 font-black text-xl italic uppercase">
                      Unlocked
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="locked"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <Lock
                      size={64}
                      className="text-white mb-2 group-hover:scale-110 transition-transform"
                    />
                    <span className="text-white font-black text-4xl italic uppercase">
                      BOX {index + 1}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleExit}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
            />

            <motion.div
              onDoubleClick={handleDoubleClick}
              initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotateY: 90 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className={`relative bg-white p-16 rounded-[4rem] shadow-2xl text-center max-w-[95vw] w-full border-[12px] border-white z-10 flex flex-col items-center justify-center overflow-hidden select-none ${showShlok ? "cursor-pointer" : "cursor-help"}`}
              onClick={handleExit}
            >
              {showShlok && (
                <button
                  onClick={handleExit}
                  className="absolute top-8 right-8 p-3 bg-red-500 text-white rounded-2xl shadow-lg border-4 border-white active:scale-90 z-50"
                >
                  <X size={32} strokeWidth={4} />
                </button>
              )}

              <AnimatePresence mode="wait">
                {!showShlok ? (
                  <motion.div
                    key="number-reveal"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                    className="w-full flex flex-col items-center justify-center px-10"
                  >
                    <div className="text-slate-400 text-2xl uppercase font-black tracking-widest mb-4">
                      Shlok Number
                    </div>
                    <span className="font-black text-blue-600 leading-tight drop-shadow-xl text-center block w-full text-[15vw]">
                      {activeItem.shlokNum}
                    </span>
                   
                  </motion.div>
                ) : (
                  <motion.div
                    key="shlok-reveal"
                    initial={{ opacity: 0, rotateX: 90 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    className="w-full flex flex-col items-center justify-center "
                  >
                    <div className="text-green-600 text-2xl uppercase font-black tracking-widest mb-8 italic">
                      Correct Shlok
                    </div>
                    <div className="bg-white border-2 border-slate-100 p-12 rounded-[2.5rem] shadow-sm w-full">
                      <div
                        className="font-gujarati font-bold text-slate-800 text-center leading-[1.8]"
                        style={{ fontSize: "min(3.8vw, 56px)" }}
                      >
                        {formatShlok(ANSWERS[activeItem.index])}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
