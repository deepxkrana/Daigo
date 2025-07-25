import React, { useState } from 'react';
import { Brain, Target, Skull, Trophy, Zap, Clock } from 'lucide-react';
import RankBadge from './RankBadge';
import { StudyEntry } from '../types/StudyEntry';
import { calculateStats, getRankInfo } from '../utils/calculations';

interface DashboardProps {
  onAddEntry: (entry: StudyEntry) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onAddEntry }) => {
  const [totalHours, setTotalHours] = useState<number>(8);
  const [productiveHours, setProductiveHours] = useState<number>(0);
  const [questionsSolved, setQuestionsSolved] = useState<number>(0);
  const [wastedTime, setWastedTime] = useState<number>(0);

  const stats = calculateStats(productiveHours, questionsSolved, wastedTime);
  const rankInfo = getRankInfo(stats.kdRatio, stats.qph);

  const handleSubmit = () => {
    if (productiveHours === 0 && questionsSolved === 0) return;

    const entry: StudyEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      totalHours,
      productiveHours,
      questionseSolved: questionsSolved,
      wastedTime,
      kills: stats.kills,
      deaths: stats.deaths,
      kdRatio: stats.kdRatio,
      qph: stats.qph,
      rank: rankInfo.name,
      rankEmoji: rankInfo.emoji,
    };

    onAddEntry(entry);
    
    // Reset form
    setProductiveHours(0);
    setQuestionsSolved(0);
    setWastedTime(0);
  };

  return (
    <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white/95 mb-3 tracking-tight">Daily Dashboard</h2>
        <p className="text-white/60 font-medium">Track your productivity and level up!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Input Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-cyan-300/90 flex items-center gap-3">
            <Clock className="w-5 h-5" />
            Daily Input
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 mb-3 font-medium">Total Hours Available</label>
              <input
                type="number"
                value={totalHours}
                onChange={(e) => setTotalHours(Number(e.target.value))}
                className="w-full bg-white/10 backdrop-blur-xl text-white rounded-2xl px-5 py-4 border border-white/20 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/20 transition-all duration-300 placeholder-white/40"
                min="0"
                max="24"
              />
            </div>
            
            <div>
              <label className="block text-white/80 mb-3 font-medium">Productive Hours</label>
              <input
                type="number"
                value={productiveHours}
                onChange={(e) => setProductiveHours(Number(e.target.value))}
                className="w-full bg-white/10 backdrop-blur-xl text-white rounded-2xl px-5 py-4 border border-white/20 focus:border-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-300/20 transition-all duration-300 placeholder-white/40"
                min="0"
                step="0.5"
              />
            </div>
            
            <div>
              <label className="block text-white/80 mb-3 font-medium">Questions Solved</label>
              <input
                type="number"
                value={questionsSolved}
                onChange={(e) => setQuestionsSolved(Number(e.target.value))}
                className="w-full bg-white/10 backdrop-blur-xl text-white rounded-2xl px-5 py-4 border border-white/20 focus:border-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-300/20 transition-all duration-300 placeholder-white/40"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-white/80 mb-3 font-medium">Wasted Time (Hours)</label>
              <input
                type="number"
                value={wastedTime}
                onChange={(e) => setWastedTime(Number(e.target.value))}
                className="w-full bg-white/10 backdrop-blur-xl text-white rounded-2xl px-5 py-4 border border-white/20 focus:border-red-300/60 focus:outline-none focus:ring-2 focus:ring-red-300/20 transition-all duration-300 placeholder-white/40"
                min="0"
                step="0.5"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-purple-300/90 flex items-center gap-3">
            <Trophy className="w-5 h-5" />
            Live Stats
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 backdrop-blur-xl border border-emerald-400/20 rounded-2xl p-5 text-center shadow-lg shadow-emerald-500/5">
              <Target className="w-8 h-8 text-emerald-300 mx-auto mb-3" />
              <div className="text-2xl font-bold text-emerald-200">{stats.kills}</div>
              <div className="text-sm text-white/70 font-medium">Kills</div>
            </div>
            
            <div className="bg-red-500/10 backdrop-blur-xl border border-red-400/20 rounded-2xl p-5 text-center shadow-lg shadow-red-500/5">
              <Skull className="w-8 h-8 text-red-300 mx-auto mb-3" />
              <div className="text-2xl font-bold text-red-200">{stats.deaths}</div>
              <div className="text-sm text-white/70 font-medium">Deaths</div>
            </div>
            
            <div className="bg-amber-500/10 backdrop-blur-xl border border-amber-400/20 rounded-2xl p-5 text-center shadow-lg shadow-amber-500/5">
              <Zap className="w-8 h-8 text-amber-300 mx-auto mb-3" />
              <div className="text-2xl font-bold text-amber-200">{stats.kdRatio}</div>
              <div className="text-sm text-white/70 font-medium">K/D Ratio</div>
            </div>
            
            <div className="bg-cyan-500/10 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-5 text-center shadow-lg shadow-cyan-500/5">
              <Brain className="w-8 h-8 text-cyan-300 mx-auto mb-3" />
              <div className="text-2xl font-bold text-cyan-200">{stats.qph}</div>
              <div className="text-sm text-white/70 font-medium">QPH</div>
            </div>
          </div>
          
          <RankBadge rankInfo={rankInfo} />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={productiveHours === 0 && questionsSolved === 0}
        className="w-full bg-gradient-to-r from-purple-500/80 to-cyan-500/80 hover:from-purple-500 hover:to-cyan-500 disabled:from-white/10 disabled:to-white/10 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 disabled:hover:scale-100 disabled:cursor-not-allowed backdrop-blur-xl border border-white/20"
      >
        {productiveHours === 0 && questionsSolved === 0 ? 'Enter Some Data First' : 'Log Today\'s Progress 🚀'}
      </button>
    </div>
  );
};

export default Dashboard;