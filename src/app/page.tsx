'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { syllabusData } from '@/data/syllabus';
import { useSyllabus } from '@/hooks/useSyllabus';
import { ChevronDown, Check, Bell } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [verificationData, setVerificationData] = useState<{
    isOpen: boolean;
    type: 'topic' | 'revision';
    id: string;
    revIndex?: number;
    expectedKey: string;
    input: string;
  }>({ isOpen: false, type: 'topic', id: '', expectedKey: '', input: '' });
  
  const { progress, toggleTopic, toggleRevision, forceToggleTopic, forceToggleRevision, mounted } = useSyllabus();

  if (!mounted) return null; // Avoid hydration mismatch

  const currentSyllabus = syllabusData.find(s => s.classLevel === selectedClass);
  const activeSubject = currentSyllabus?.subjects.find(s => s.id === selectedSubjectId) || currentSyllabus?.subjects[0];

  // Calculate total due
  const REVISION_INTERVALS = [3, 7, 14, 30, 90];
  let dueCount = 0;
  Object.values(progress).forEach(p => {
    if (p.completed && p.completionDate) {
      const revsDone = (p.revisions || [false, false, false, false]).filter(Boolean).length;
      if (revsDone < REVISION_INTERVALS.length) {
        const nextDue = p.completionDate + (REVISION_INTERVALS[revsDone] * 86400000);
        if (nextDue <= Date.now()) dueCount++;
      }
    }
  });

  const getSubjectColor = (subjectName: string) => {
    switch (subjectName.toLowerCase()) {
      case 'physics': return 'text-[#00f0ff]'; // Electric Cyan
      case 'chemistry': return 'text-[#b500ff]'; // Neon Purple
      case 'mathematics': return 'text-[#ff5e00]'; // Bright Orange
      default: return 'text-white';
    }
  };

  const getSubjectHoverBorder = (subjectName: string) => {
    switch (subjectName.toLowerCase()) {
      case 'physics': return 'hover:border-[#00f0ff] hover:text-[#00f0ff]';
      case 'chemistry': return 'hover:border-[#b500ff] hover:text-[#b500ff]';
      case 'mathematics': return 'hover:border-[#ff5e00] hover:text-[#ff5e00]';
      default: return 'hover:border-white hover:text-white';
    }
  };

  const getSubjectActiveBg = (subjectName: string) => {
    switch (subjectName.toLowerCase()) {
      case 'physics': return 'bg-[#00f0ff] border-[#00f0ff]';
      case 'chemistry': return 'bg-[#b500ff] border-[#b500ff]';
      case 'mathematics': return 'bg-[#ff5e00] border-[#ff5e00]';
      default: return 'bg-white border-white';
    }
  };

  const getSubjectActiveTextBorder = (subjectName: string) => {
    switch (subjectName.toLowerCase()) {
      case 'physics': return 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10';
      case 'chemistry': return 'border-[#b500ff] text-[#b500ff] bg-[#b500ff]/10';
      case 'mathematics': return 'border-[#ff5e00] text-[#ff5e00] bg-[#ff5e00]/10';
      default: return 'border-white text-white bg-white/10';
    }
  };

  const getSubjectBorderColor = (subjectName: string) => {
    switch (subjectName.toLowerCase()) {
      case 'physics': return 'border-[#00f0ff]';
      case 'chemistry': return 'border-[#b500ff]';
      case 'mathematics': return 'border-[#ff5e00]';
      default: return 'border-white';
    }
  };

  return (
    <main className="min-h-screen bg-[#000000] text-white selection:bg-white/30 relative overflow-x-hidden font-mono">
      {/* Subtle CSS Noise */}
      <div className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

      <AnimatePresence mode="wait">
        {!selectedClass ? (
          <motion.div 
            key="class-selector"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]"
          >
            <div className="border border-white/10 bg-[#000000] p-10 w-full max-w-md flex flex-col gap-8 relative rounded-none shadow-none">
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-3xl font-black tracking-tighter uppercase">Welcome to PCM Tracker</h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Select your class to begin</p>
              </div>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    setSelectedClass('11');
                    const c11 = syllabusData.find(s => s.classLevel === '11');
                    if (c11) setSelectedSubjectId(c11.subjects[0].id);
                  }}
                  className="w-full border border-white/10 py-5 hover:bg-white hover:text-black transition-colors uppercase font-bold tracking-widest text-sm rounded-none"
                >
                  Class 11
                </button>
                <button 
                  onClick={() => {
                    setSelectedClass('12');
                    const c12 = syllabusData.find(s => s.classLevel === '12');
                    if (c12) setSelectedSubjectId(c12.subjects[0].id);
                  }}
                  className="w-full border border-white/10 py-5 hover:bg-white hover:text-black transition-colors uppercase font-bold tracking-widest text-sm rounded-none"
                >
                  Class 12
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-6xl mx-auto flex flex-col gap-8 p-6 md:p-12"
          >
            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedClass(null)}
                  className="text-xs text-gray-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="border border-white/10 px-2 py-1 rounded-none hover:bg-white/10">← Back</span>
                </button>
                <div className="text-lg font-black uppercase tracking-tighter">
                  Class {selectedClass} PCM
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full sm:w-auto">
                {/* Due Revisions */}
                <div className="flex items-center justify-between sm:justify-start gap-3 border border-white/10 p-2 px-4 rounded-none h-[42px]">
                  <span className="text-xs text-gray-500 uppercase tracking-widest">Due</span>
                  <div className={`flex items-center gap-2 ${dueCount > 0 ? 'text-[#ff003c]' : 'text-white'}`}>
                    <Bell size={14} />
                    <span className="font-bold">{dueCount}</span>
                  </div>
                </div>

                {/* Subject Selector */}
                <div className="flex items-center border border-white/10 rounded-none bg-[#0a0a0a] overflow-x-auto h-[42px]">
                  {currentSyllabus?.subjects.map(subject => {
                    const isActive = subject.id === activeSubject?.id;
                    const hoverClass = getSubjectHoverBorder(subject.name);
                    return (
                      <button
                        key={subject.id}
                        onClick={() => setSelectedSubjectId(subject.id)}
                        className={`px-4 h-full flex items-center text-xs uppercase font-bold tracking-widest transition-all rounded-none border-b-2 whitespace-nowrap ${isActive ? getSubjectActiveTextBorder(subject.name) : `border-transparent text-gray-500 ${hoverClass}`}`}
                      >
                        {subject.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            </header>

            {/* MAIN CONTENT AREA */}
            {activeSubject && (
              <motion.div 
                key={activeSubject.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-end justify-between pb-4">
                  <h2 className={`text-4xl md:text-5xl font-black uppercase tracking-tighter ${getSubjectColor(activeSubject.name)}`}>
                    {activeSubject.name}
                  </h2>
                  
                  {/* Subject Progress */}
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Subject Progress</div>
                    <div className="text-xl font-bold">
                      {Math.round((activeSubject.topics.filter(t => progress[t.id]?.completed).length / activeSubject.topics.length) * 100) || 0}%
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 border-t border-white/10 pt-4">
                  {activeSubject.topics.map((topic, index) => {
                    const isCompleted = progress[topic.id]?.completed;
                    const revs = progress[topic.id]?.revisions || [false, false, false, false];
                    const isFinalDone = revs[3];
                    
                    return (
                      <div 
                        key={topic.id} 
                        className={`group flex flex-col lg:flex-row lg:items-center justify-between p-4 gap-4 border transition-colors rounded-none ${isFinalDone ? `bg-white/5 ${getSubjectBorderColor(activeSubject.name)}` : 'bg-[#0a0a0a] border-white/10 hover:border-white/30'}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600 text-xs w-6 text-right font-bold">{index + 1}.</span>
                          <span className={`uppercase text-sm tracking-wide transition-colors ${isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>
                            {topic.name}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                          <button 
                            onClick={() => {
                              const res = toggleTopic(topic.id);
                              if (!res.success && res.requiresVerification) {
                                setVerificationData({
                                  isOpen: true,
                                  type: 'topic',
                                  id: topic.id,
                                  expectedKey: res.expectedKey!,
                                  input: ''
                                });
                              } else if (!res.success) {
                                toast.error(res.message);
                              }
                            }}
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all rounded-none ${isCompleted ? 'border-white bg-white text-black' : 'border-white/20 text-gray-400 hover:border-white/50 hover:text-white'}`}
                          >
                            Done
                            <div className={`w-3 h-3 flex items-center justify-center ${isCompleted ? 'text-black' : 'hidden'}`}>
                              <Check size={12} strokeWidth={4} />
                            </div>
                          </button>
                          
                          {isCompleted && (
                            <div className="flex items-center gap-1 border-l border-white/20 pl-3">
                              {['R1', 'R2', 'R3', 'FINAL'].map((lbl, idx) => {
                                const revsDone = revs.filter(Boolean).length;
                                let hint = "";
                                if (idx === revsDone) {
                                  const nextDue = progress[topic.id]?.completionDate ? progress[topic.id].completionDate! + (REVISION_INTERVALS[revsDone] * 86400000) : null;
                                  const daysLeft = nextDue ? Math.ceil((nextDue - Date.now()) / 86400000) : null;
                                  if (daysLeft !== null) {
                                    hint = daysLeft <= 0 ? " (DUE)" : ` (${daysLeft}d)`;
                                  }
                                }
                                return (
                                  <button
                                    key={idx}
                                    title={hint ? `Status: ${hint}` : ""}
                                    onClick={() => {
                                      const res = toggleRevision(topic.id, idx);
                                      if (!res.success && res.requiresVerification) {
                                        setVerificationData({
                                          isOpen: true,
                                          type: 'revision',
                                          id: topic.id,
                                          revIndex: idx,
                                          expectedKey: res.expectedKey!,
                                          input: ''
                                        });
                                      } else if (!res.success) {
                                        toast.error(res.message);
                                      }
                                    }}
                                    className={`flex items-center justify-center min-w-[40px] px-2 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all rounded-none ${revs[idx] ? `${getSubjectActiveBg(activeSubject.name)} text-black` : 'border-white/20 text-gray-500 hover:border-white/50 hover:text-white'}`}
                                  >
                                    {lbl}{hint}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {verificationData.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-black border border-white p-6 max-w-sm w-full flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2 text-center">
                <h2 className="text-xl font-bold uppercase tracking-widest text-[#ff003c]">Verification Required</h2>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Type the code below to confirm undo action.
                </p>
              </div>
              <div className="bg-white/10 p-3 text-center border border-white/20">
                <span className="text-2xl font-black tracking-widest select-all">{verificationData.expectedKey}</span>
              </div>
              <input 
                type="text" 
                autoFocus
                placeholder="Enter security code"
                value={verificationData.input}
                onChange={(e) => setVerificationData(prev => ({ ...prev, input: e.target.value.toUpperCase() }))}
                className="bg-transparent border border-white/30 p-3 text-center uppercase tracking-widest outline-none focus:border-white transition-colors text-xl font-bold"
              />
              <div className="flex gap-4">
                <button 
                  onClick={() => setVerificationData(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 border border-white/30 py-3 uppercase text-xs font-bold tracking-widest hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (verificationData.input === verificationData.expectedKey) {
                      if (verificationData.type === 'topic') {
                        forceToggleTopic(verificationData.id);
                      } else if (verificationData.type === 'revision' && verificationData.revIndex !== undefined) {
                        forceToggleRevision(verificationData.id, verificationData.revIndex);
                      }
                      setVerificationData(prev => ({ ...prev, isOpen: false }));
                      toast.success("Action undone successfully.");
                    } else {
                      toast.error("Incorrect security code.");
                    }
                  }}
                  className="flex-1 bg-white text-black py-3 uppercase text-xs font-bold tracking-widest hover:bg-gray-200 transition-colors"
                >
                  Verify
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
