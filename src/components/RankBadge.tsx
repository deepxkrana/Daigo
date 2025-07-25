import React from 'react';
import { Crown, Award, Medal, Star } from 'lucide-react';
import { RankInfo } from '../types/StudyEntry';

interface RankBadgeProps {
  rankInfo: RankInfo;
}

const RankBadge: React.FC<RankBadgeProps> = ({ rankInfo }) => {
  const getRankIcon = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'godlike': return <Crown className="w-6 h-6" />;
      case 'elite': return <Award className="w-6 h-6" />;
      case 'pro': return <Medal className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  return (
    <div className={`bg-gradient-to-r ${rankInfo.color} rounded-3xl p-6 text-center border border-white/30 shadow-2xl backdrop-blur-xl`}>
      <div className="flex items-center justify-center mb-3">
        <span className="text-4xl mr-2">{rankInfo.emoji}</span>
        <div className="text-white/95">
          {getRankIcon(rankInfo.name)}
        </div>
      </div>
      
      <div className="text-2xl font-bold text-white/95 mb-2 tracking-tight">{rankInfo.name}</div>
      <div className="text-sm text-white/75 font-medium">{rankInfo.message}</div>
    </div>
  );
};

export default RankBadge;