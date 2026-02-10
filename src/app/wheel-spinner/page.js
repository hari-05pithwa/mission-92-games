"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import confetti from "canvas-confetti";

// --- STARTING WORDS INSTEAD OF NUMBERS ---
const INITIAL_WORDS = [
  "स्वामिनारायणेऽनन्य",
  "दुःखलज्जाभयक्रोध",
  "सत्सङ्गस्याऽस्य",
  "भगतजी",
];

const COLORS = [
  "#FF6B6B",
  "#FFD93D",
  "#4D96FF",
  "#9B59B6",
  "#6BCB77",
  "#FF923E",
];


const ANSWERS = {
  स्वामिनारायणेऽनन्य:
    "स्वामिनारायणेऽनन्य-दृढपरमभक्तये। गृहीत्वाऽऽश्रयदीक्षाया मन्त्रं सत्सङ्गमाप्नुयात्॥ १८॥",
  दुःखलज्जाभयक्रोध:
    "दुःखलज्जाभयक्रोध-रोगाद्यापत्तिकारणात्। धर्माऽर्थमपि कश्चिद्धि हन्यान्न स्वं न वा परम्॥ ४२॥",
  सत्सङ्गस्याऽस्य:
    "सत्सङ्गस्याऽस्य विज्ञानं मुमुक्षूणां भवेदिति। शास्त्रं सत्सङ्गदीक्षेति शुभाऽऽशयाद् विरच्यते॥ ७॥",
  भगतजी:
    "भगतजी महाराज-साक्षाद् विज्ञान मूर्तये। यज्ञपुरुषदासाय सत्यसिद्धान्तरक्षिणे॥ ३१२॥",
};

export default function WheelSpinnerPage() {
  const [words, setWords] = useState(INITIAL_WORDS);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const canvasRef = useRef(null);
  const startAngle = useRef(0);
  const spinAngleStart = useRef(0);
  const spinTime = useRef(0);
  const spinTimeTotal = useRef(0);
  const requestRef = useRef(null);

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      confetti.reset();
    };
  }, []);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas || words.length === 0) return;
    const ctx = canvas.getContext("2d");
    const arc = Math.PI / (words.length / 2);
    ctx.clearRect(0, 0, 500, 500);

    words.forEach((word, i) => {
      const angle = startAngle.current + i * arc;
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.arc(250, 250, 230, angle, angle + arc, false);
      ctx.lineTo(250, 250);
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.fillStyle = "white";
      ctx.translate(
        250 + Math.cos(angle + arc / 2) * 140,
        250 + Math.sin(angle + arc / 2) * 140,
      );
      ctx.rotate(angle + arc / 2 + Math.PI / 2);

      // Dynamic font size for words on the wheel
      const fontSize = words.length > 5 ? 14 : 18;
      ctx.font = `bold ${fontSize}px sans-serif`;

      const text = word.toString();
      // Draw text horizontally relative to its segment center
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    });
  };

  const rotateWheel = () => {
    spinTime.current += 30;
    if (spinTime.current >= spinTimeTotal.current) {
      stopRotateWheel();
      return;
    }
    const spinAngle =
      spinAngleStart.current -
      easeOut(
        spinTime.current,
        0,
        spinAngleStart.current,
        spinTimeTotal.current,
      );
    startAngle.current += (spinAngle * Math.PI) / 180;
    drawWheel();
    requestAnimationFrame(rotateWheel);
  };

  const stopRotateWheel = () => {
    setIsSpinning(false);
    const degrees = (startAngle.current * 180) / Math.PI + 90;
    const arcd = ((Math.PI / (words.length / 2)) * 180) / Math.PI;
    const index = Math.floor((360 - (degrees % 360)) / arcd) % words.length;
    const winningWord = words[index];
    setWinner(winningWord);
    setShowAnswer(false);
    setTimeout(
      () => setWords((prev) => prev.filter((w) => w !== winningWord)),
      100,
    );
  };

  const triggerCelebration = () => {
    const end = Date.now() + 1500;
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.8 },
        colors: COLORS,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.8 },
        colors: COLORS,
      });
      if (Date.now() < end) requestRef.current = requestAnimationFrame(frame);
    };
    frame();
  };

  const handleDoubleClick = () => {
    if (!showAnswer) {
      setShowAnswer(true);
      triggerCelebration();
    }
  };

  const handleExit = () => {
    if (showAnswer) {
      setWinner(null);
      setShowAnswer(false);
      confetti.reset();
    }
  };

  const easeOut = (t, b, c, d) => {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  };

  const handleSpin = () => {
    if (isSpinning || words.length === 0) return;

    // DIRECT POPUP IF ONLY ONE WORD LEFT
    if (words.length === 1) {
      const lastWord = words[0];
      setWinner(lastWord);
      setShowAnswer(false);
      setWords([]);
      return;
    }

    setIsSpinning(true);
    setWinner(null);
    spinAngleStart.current = Math.random() * 5 + 15;
    spinTime.current = 0;
    spinTimeTotal.current = 6000 + Math.random() * 2000;
    rotateWheel();
  };

  useEffect(() => {
    drawWheel();
  }, [words]);

  const formatShlok = (text) => {
    if (!text) return null;
    const parts = text.split(/(?<=[।])/);
    return (
      <div className="flex flex-col gap-4 font-sanskrit">
        {parts.map((line, index) => (
          <span
            key={index}
            className="block whitespace-nowrap overflow-visible"
          >
            {line.trim()}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="h-screen w-screen bg-[#FFFDF0] flex flex-col items-center p-6 relative font-sans overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-yellow-200/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-blue-200/40 blur-[100px] rounded-full" />
      </div>

      <nav className="relative w-full flex justify-center items-center mt-4 mb-20 z-20">
        <div className="flex flex-col items-center max-w-fit">
          <h1 className="text-5xl font-black text-slate-800 tracking-tight flex items-center gap-4 italic uppercase">
            ROUND 1
          </h1>
          <div className="h-3 w-full bg-blue-400 rounded-full mt-3 border-2 border-slate-800 shadow-[3px_3px_0px_#1e3a8a]" />
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center relative font-sanskrit">
        <motion.div
          onClick={handleSpin}
          className={`relative p-4 bg-white rounded-full shadow-2xl border-[10px] border-white ${isSpinning ? "cursor-default" : "cursor-pointer"}`}
        >
          <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-red-600" />
          </div>
          <canvas
            ref={canvasRef}
            width="500"
            height="500"
            className="rounded-full"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full border-[6px] border-slate-800 shadow-xl z-10 flex items-center justify-center pointer-events-none">
            <p className="text-slate-800 font-black text-xs italic uppercase">
              Spin
            </p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {winner && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/20 backdrop-blur-md font-sanskrit">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleExit}
              className="absolute inset-0 z-0"
            />

            <motion.div
              onDoubleClick={handleDoubleClick}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`relative bg-white p-12 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] text-center max-w-[95vw] w-full border border-slate-100 overflow-hidden select-none z-10 ${showAnswer ? "cursor-pointer" : "cursor-help"}`}
              onClick={handleExit}
            >
              {showAnswer && (
                <button
                  onClick={handleExit}
                  className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full text-slate-300 z-50"
                >
                  <X size={28} />
                </button>
              )}

              <AnimatePresence mode="wait">
                <motion.h2
                  key={showAnswer ? "ans-title" : "num-title"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-2xl font-bold uppercase tracking-[0.3em] mb-4 italic ${showAnswer ? "text-green-600" : "text-slate-400"}`}
                >
                  {showAnswer ? "Correct Answer" : "Shlok Start"}
                </motion.h2>
              </AnimatePresence>

              <div className="flex items-center justify-center min-h-[350px]">
                <AnimatePresence mode="wait">
                  {!showAnswer ? (
                    <motion.div
                      key="number"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.8, filter: "blur(20px)" }}
                      className="text-[6rem] md:text-[8rem] font-black text-blue-600 leading-none drop-shadow-md"
                    >
                      {winner}...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="answer"
                      initial={{ opacity: 0, rotateX: -90 }}
                      animate={{ opacity: 1, rotateX: 0 }}
                      className="w-full"
                    >
                      <div className="font-sanskrit bg-white border-2 border-slate-100 p-12 rounded-[2.5rem] shadow-sm">
                        <div
                          className="font-sanskrit font-bold text-slate-800 text-center"
                          style={{ fontSize: "min(3.5vw, 52px)" }}
                        >
                          {formatShlok(ANSWERS[winner])}
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
