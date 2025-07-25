import React from 'react';
import { Flame, Gift, Trophy, Star } from 'lucide-react';
import { StudyEntry } from '../types/StudyEntry';

interface StreakProps {
  streak: number;
  entries: StudyEntry[];
}

const Streak: React.FC<StreakProps> = ({ streak, entries }) => {
  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your journey! 🚀";
    if (streak < 3) return "Keep building! 💪";
    if (streak < 7) return "You're on fire! 🔥";
    if (streak < 14) return "Unstoppable! ⚡";
    return "LEGENDARY! 👑";
  };

  const getReward = (streak: number) => {
    if (streak >= 30) return "🎮 1 hour game time + movie night!";
    if (streak >= 21) return "🍕 Order your favorite meal!";
    if (streak >= 14) return "🎬 Watch a movie guilt-free!";
    if (streak >= 7) return "🎮 30 minutes game time!";
    if (streak >= 3) return "☕ Treat yourself to coffee!";
    return "Complete 3 days to unlock first reward!";
  };

  const weeklyStats = React.useMemo(() => {
    const lastWeek = entries.slice(0, 7);
    const avgKD = lastWeek.length > 0 
      ? (lastWeek.reduce((sum, entry) => sum + entry.kdRatio, 0) / lastWeek.length).toFixed(1)
      : '0.0';
    const avgQPH = lastWeek.length > 0
      ? (lastWeek.reduce((sum, entry) => sum + entry.qph, 0) / lastWeek.length).toFixed(1)
      : '0.0';
    const totalQuestions = lastWeek.reduce((sum, entry) => sum + entry.questionseSolved, 0);
    
    return { avgKD, avgQPH, totalQuestions };
  }, [entries]);

  return (
    <div className="space-y-6">
      {/* Streak Counter */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-2xl border border-orange-400/20 rounded-3xl p-6 shadow-2xl shadow-orange-500/10">
        <div className="text-center">
          <Flame className="w-12 h-12 text-orange-300 mx-auto mb-3" />
          <div className="text-4xl font-bold text-orange-200 mb-2">{streak}</div>
          <div className="text-white/80 font-medium mb-3">Day Streak</div>
          <div className="text-sm text-orange-200/80">{getStreakMessage(streak)}</div>
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl shadow-black/20">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-purple-300" />
          <h3 className="text-lg font-semibold text-white/95">Weekly Stats</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/70">Avg K/D:</span>
            <span className="text-amber-300 font-bold">{weeklyStats.avgKD}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Avg QPH:</span>
            <span className="text-cyan-300 font-bold">{weeklyStats.avgQPH}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Total Questions:</span>
            <span className="text-emerald-300 font-bold">{weeklyStats.totalQuestions}</span>
          </div>
        </div>
      </div>

      {/* Rewards */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-2xl border border-purple-400/20 rounded-3xl p-6 shadow-2xl shadow-purple-500/10">
        <div className="text-center">
          <Gift className="w-8 h-8 text-purple-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white/95 mb-3">Current Reward</h3>
          <div className="text-sm text-purple-200/80 bg-purple-500/10 backdrop-blur-xl rounded-2xl p-4 border border-purple-400/20">
            {getReward(streak)}
          </div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-2xl border border-cyan-400/20 rounded-3xl p-6 shadow-2xl shadow-cyan-500/10">
        <div className="text-center">
          <Star className="w-8 h-8 text-cyan-300 mx-auto mb-3" />
          <div className="text-sm text-cyan-200/80 italic">
            "Success is the sum of small efforts repeated day in and day out."
          </div>
          <div className="text-xs text-white/50 mt-2">- Robert Collier</div>
        </div>
      </div>
    </div>
  );
};

export default Streak;