import { RankInfo } from '../types/StudyEntry';

export const calculateStats = (productiveHours: number, questionsSolved: number, wastedTime: number) => {
  // Kills calculation: productive hours + bonus for questions
  const kills = Math.round((productiveHours * 10) + (questionsSolved * 2));
  
  // Deaths calculation: wasted time
  const deaths = Math.max(1, Math.round(wastedTime * 10)); // Minimum 1 to avoid division by zero
  
  // KD Ratio
  const kdRatio = Number((kills / deaths).toFixed(1));
  
  // QPH (Questions Per Hour)
  const qph = productiveHours > 0 ? Number((questionsSolved / productiveHours).toFixed(1)) : 0;
  
  return { kills, deaths, kdRatio, qph };
};

export const getRankInfo = (kdRatio: number, qph: number): RankInfo => {
  // Combined score for ranking
  const score = kdRatio + (qph * 0.5);
  
  if (score >= 8) {
    return {
      name: 'GODLIKE',
      emoji: '👑',
      color: 'from-yellow-400/80 to-orange-500/80 border-yellow-400/30',
      message: 'You are absolutely crushing it! 🔥'
    };
  } else if (score >= 5) {
    return {
      name: 'ELITE',
      emoji: '🏆',
      color: 'from-purple-500/80 to-pink-500/80 border-purple-400/30',
      message: 'Elite performance! Keep dominating! ⚡'
    };
  } else if (score >= 3) {
    return {
      name: 'PRO',
      emoji: '🎯',
      color: 'from-blue-500/80 to-cyan-500/80 border-blue-400/30',
      message: 'Solid work! You\'re getting stronger! 💪'
    };
  } else if (score >= 1.5) {
    return {
      name: 'RISING',
      emoji: '📈',
      color: 'from-green-500/80 to-emerald-500/80 border-green-400/30',
      message: 'Good progress! Keep building momentum! 🚀'
    };
  } else {
    return {
      name: 'NOOB',
      emoji: '🌱',
      color: 'from-gray-500/80 to-slate-500/80 border-gray-400/30',
      message: 'Everyone starts somewhere! You got this! 💫'
    };
  }
};