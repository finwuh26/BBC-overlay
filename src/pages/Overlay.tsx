import React, { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { useElectionData } from "../lib/useElectionData";
import { cn } from "../lib/utils";

const BBC_LOGO = () => (
  <div className="flex shrink-0 items-center gap-1.5 font-bold">
    <div className="flex gap-[3px]">
      <span className="w-[30px] h-[30px] flex items-center justify-center bg-white text-black text-[18px] font-bold">B</span>
      <span className="w-[30px] h-[30px] flex items-center justify-center bg-white text-black text-[18px] font-bold">B</span>
      <span className="w-[30px] h-[30px] flex items-center justify-center bg-white text-black text-[18px] font-bold">C</span>
    </div>
    <span className="text-white text-[24px] tracking-widest ml-1 font-medium pb-0.5">ELECTION</span>
  </div>
);

const CrystalLogo = () => (
    <div className="w-[38px] h-[38px] relative shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-yellow-400 opacity-90" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
        <div className="absolute inset-[3px] bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-90 mix-blend-screen" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
        <div className="absolute inset-0 drop-shadow-md bg-white/30" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
    </div>
)

const getPartyTextColor = (partyId: string) => {
    return ['ld', 'snp', 'ref', 'pc'].includes(partyId.toLowerCase()) ? 'text-black' : 'text-white';
};

export default function Overlay() {
  const { data } = useElectionData();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return null;

  const displayParties = data.parties.filter((p: any) => p.visible);

  if (data.theme === 'news') {
    return (
      <div className="w-full h-screen bg-transparent pointer-events-none overflow-hidden relative font-sans" style={{ '--font-sans': '"Reith Sans", "Helvetica Neue", Helvetica, Arial, sans-serif' } as React.CSSProperties}>
        {/* Lower Third Graphic Container - 1:1 BBC Style */}
        <div className="absolute bottom-[40px] left-[40px] right-[40px] flex flex-col drop-shadow-lg font-sans">
          
          <div className="flex flex-col bg-[#B80000]">
              <div className="flex w-full items-center pl-6 pt-5 pb-1">
                   <div className="flex shrink-0 items-center gap-1.5 font-bold">
                      <div className="flex gap-[3px]">
                        <span className="w-[30px] h-[30px] flex items-center justify-center bg-white text-black text-[18px] font-bold">B</span>
                        <span className="w-[30px] h-[30px] flex items-center justify-center bg-white text-black text-[18px] font-bold">B</span>
                        <span className="w-[30px] h-[30px] flex items-center justify-center bg-white text-black text-[18px] font-bold">C</span>
                      </div>
                      <span className="text-white text-[24px] tracking-widest ml-1 font-medium pb-0.5">NEWS</span>
                  </div>
              </div>
              <div className="flex w-full">
                  <div className="flex-1 px-6 pb-6 pt-3 flex flex-col justify-center">
                      <motion.h1
                          key={data.headline}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-white font-medium tracking-normal"
                          style={{ fontFamily: 'Georgia, "Reith Serif", serif', fontSize: '50px', letterSpacing: '-0.01em', lineHeight: '1.2' }}
                      >
                      {data.headline}
                      </motion.h1>
                  </div>
              </div>
          </div>
  
          {/* Ticker Bottom Bar */}
          <div className="flex h-[56px] relative z-10 w-full mt-[1px]">
              {/* Ticker Content */}
              <div className="flex-1 bg-white overflow-hidden shadow-inner flex items-center px-6">
                      <div className="flex items-center h-full gap-4 text-[#404040] text-[26px] font-medium leading-none">
                          <div className="w-[14px] h-[14px] bg-[#B80000] shrink-0 mb-[2px]"></div>
                          <AnimatePresence mode="wait">
                              <motion.span
                                  key={data.tickerItems[0]}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="truncate"
                              >
                                  {data.tickerItems[0]}
                              </motion.span>
                          </AnimatePresence>
                      </div>
              </div>
  
              {/* Clock */}
              <div className="w-[120px] flex items-center justify-center bg-[#B80000] text-white font-bold text-[30px] shrink-0">
                  {format(time, "HH:mm")}
              </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-transparent pointer-events-none overflow-hidden relative font-sans" style={{ '--font-sans': '"Reith Sans", "Helvetica Neue", Helvetica, Arial, sans-serif' } as React.CSSProperties}>
      {/* Lower Third Graphic Container - 1:1 BBC Style */}
      <div className="absolute bottom-[40px] left-[40px] right-[40px] flex flex-col drop-shadow-2xl font-sans" style={{ letterSpacing: '0.01em' }}>
        
        {/* Top Floating Badge Bar */}
        <div className="flex items-end mb-[2px] z-10 w-full relative">
          <div className="flex items-end flex-initial">
             {/* Main Logo Block */}
            <div className="bg-[#280058] px-5 py-3 flex items-center gap-4">
              <BBC_LOGO />
              <CrystalLogo />
            </div>

            {/* Breaking Badge next to it */}
            <AnimatePresence>
              {data.breaking && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white text-[#280058] font-bold px-4 py-[13px] text-[22px] uppercase tracking-widest ml-[2px]"
                >
                  BREAKING
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 flex justify-end text-white font-bold tracking-widest pb-1 uppercase text-[24px]">
            {data.mode === "exit_poll" ? "EXIT POLL" : "RESULTS"}
          </div>
        </div>

        {/* Main Content Pane (Purple) */}
        <div className="flex flex-col bg-[#280058]">
            <div className="flex w-full">
                {/* Headlines */}
                <div className="flex-1 px-8 py-7 flex flex-col justify-center">
                    <motion.h1
                        key={data.headline}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white font-bold uppercase tracking-tight leading-none"
                        style={{ fontSize: '56px', letterSpacing: '-0.02em', marginBottom: '14px' }}
                    >
                    {data.headline}
                    </motion.h1>
                    <motion.h2
                        key={data.subheadline}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white text-[32px] font-medium leading-tight"
                    >
                    {data.subheadline}
                    </motion.h2>
                </div>

                {/* Scoreboard Block */}
                <div className="flex flex-col bg-[#1E0043] pl-[1px]">
                    <div className="flex h-full">
                         {displayParties.map((party: any) => {
                             const textColorClass = getPartyTextColor(party.id);
                             return (
                                <div key={party.id} className="flex flex-col border-r border-[#1E0043] last:border-0" style={{ width: displayParties.length > 4 ? '110px' : '130px' }}>
                                    <div 
                                        className={cn("h-[48px] flex items-center justify-center font-bold text-[26px] uppercase border-b border-black/15", textColorClass)}
                                        style={{ backgroundColor: party.color }}
                                    >
                                        {party.name}
                                    </div>
                                    <div 
                                        className={cn("flex-1 px-4 py-3 flex items-center justify-center font-bold", textColorClass)}
                                        style={{ backgroundColor: party.color }}
                                    >
                                        <motion.span
                                            key={party.seats}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="drop-shadow-sm"
                                            style={{ fontSize: displayParties.length > 4 ? '52px' : '64px', lineHeight: '1' }}
                                        >
                                            {party.seats}
                                        </motion.span>
                                    </div>
                                </div>
                             )
                         })}
                    </div>
                    {/* Majority Bar */}
                    <div className="bg-[#1E0043] text-center text-white py-[6px] font-medium text-[20px] tracking-wide">
                        {data.majorityTarget} for majority
                    </div>
                </div>
            </div>
        </div>

        {/* Ticker Bottom Bar */}
        <div className="flex h-[56px] relative z-10 w-full mt-[2px]">
            {/* Ticker Content */}
            <div className="flex-1 bg-white overflow-hidden shadow-inner">
                {data.tickerMode === 'results' && data.recentResults && data.recentResults.length > 0 ? (
                    // Results Flash Mode
                     <div className="flex h-full whitespace-nowrap overflow-hidden">
                         <div className="animate-[ticker_30s_linear_infinite] flex items-center h-full">
                             {/* Double up the array for infinite smooth loop */}
                             {[...data.recentResults, ...data.recentResults].map((res: any, i: number) => {
                                 const textColorClass = getPartyTextColor(res.partyId || 'lab');
                                 return (
                                     <div key={i} className="flex h-full items-center border-r-[3px] border-white font-medium text-[24px]">
                                         <div className="px-8 h-full flex items-center bg-[#E5E5E5] text-black shrink-0 relative overflow-hidden">
                                             <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: res.partyColor }}></div>
                                             {res.constituency}
                                         </div>
                                         <div 
                                            className={cn("px-8 h-full flex items-center shrink-0 uppercase font-bold tracking-wide", textColorClass)} 
                                            style={{ backgroundColor: res.partyColor }}
                                         >
                                             {res.result}
                                         </div>
                                     </div>
                                 )
                             })}
                         </div>
                     </div>
                ) : (
                    // Default Ticker Mode
                    <div className="flex items-center h-full px-6 gap-5 bg-white text-[26px] font-medium text-[#280058]">
                        <div className="w-[14px] h-[14px] bg-[#280058] shrink-0"></div>
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={data.tickerItems[0]}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="truncate"
                            >
                                {data.tickerItems[0]}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Clock */}
            <div className="w-[140px] flex items-center justify-center bg-[#1E0043] text-white font-bold text-[30px] shrink-0 ml-[2px]">
                {format(time, "HH:mm")}
            </div>
        </div>
      </div>

       <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
