import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TrackerTable from './components/TrackerTable';
import Streak from './components/Streak';
import { StudyEntry } from './types/StudyEntry';

function App() {
  const [entries, setEntries] = useState<StudyEntry[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    const savedEntries = localStorage.getItem('studyEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    
    const savedStreak = localStorage.getItem('currentStreak');
    if (savedStreak) {
      setCurrentStreak(parseInt(savedStreak));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('studyEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('currentStreak', currentStreak.toString());
  }, [currentStreak]);

  const addEntry = (entry: StudyEntry) => {
    const newEntries = [entry, ...entries];
    setEntries(newEntries);
    
    // Update streak logic
    const today = new Date().toDateString();
    const todayEntry = newEntries.find(e => new Date(e.date).toDateString() === today);
    
    if (todayEntry && todayEntry.kdRatio >= 1) {
      setCurrentStreak(prev => prev + 1);
    } else if (todayEntry && todayEntry.kdRatio < 0.5) {
      setCurrentStreak(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Floating orbs for depth */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-purple-300 mb-4 tracking-tight">
            Study KD Tracker
          </h1>
          <p className="text-white/70 text-xl font-medium">Turn Your Productivity Into a Game!</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Dashboard onAddEntry={addEntry} />
          </div>
          <div>
            <Streak streak={currentStreak} entries={entries} />
          </div>
        </div>

        <TrackerTable entries={entries} />
      </div>
    </div>
  );
}

export default App;