import React from 'react';
import { Calendar, TrendingUp, Target, Brain } from 'lucide-react';
import { StudyEntry } from '../types/StudyEntry';

interface TrackerTableProps {
  entries: StudyEntry[];
}

const TrackerTable: React.FC<TrackerTableProps> = ({ entries }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 text-center shadow-2xl shadow-black/20">
        <Calendar className="w-16 h-16 text-white/40 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white/70 mb-2">No entries yet</h3>
        <p className="text-white/50">Start tracking your study sessions to see your progress history!</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/20">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-cyan-300" />
        <h3 className="text-2xl font-bold text-white/95 tracking-tight">Progress History</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-5 px-4 text-white/70 font-semibold">Date</th>
              <th className="text-center py-5 px-4 text-white/70 font-semibold">Hours</th>
              <th className="text-center py-5 px-4 text-white/70 font-semibold">Questions</th>
              <th className="text-center py-5 px-4 text-white/70 font-semibold">K/D</th>
              <th className="text-center py-5 px-4 text-white/70 font-semibold">QPH</th>
              <th className="text-center py-5 px-4 text-white/70 font-semibold">Rank</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5 transition-all duration-300">
                <td className="py-5 px-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/50" />
                    <span className="text-white/90 font-medium">{formatDate(entry.date)}</span>
                  </div>
                </td>
                <td className="py-5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-emerald-300 font-semibold">{entry.productiveHours}</span>
                    <span className="text-white/40">/</span>
                    <span className="text-white/60">{entry.totalHours}</span>
                  </div>
                </td>
                <td className="py-5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Brain className="w-4 h-4 text-cyan-300" />
                    <span className="text-cyan-300 font-semibold">{entry.questionseSolved}</span>
                  </div>
                </td>
                <td className="py-5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Target className="w-4 h-4 text-amber-300" />
                    <span className={`font-bold ${entry.kdRatio >= 2 ? 'text-emerald-300' : entry.kdRatio >= 1 ? 'text-amber-300' : 'text-red-300'}`}>
                      {entry.kdRatio}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-4 text-center">
                  <span className="text-purple-300 font-semibold">{entry.qph}</span>
                </td>
                <td className="py-5 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">{entry.rankEmoji}</span>
                    <span className="text-white/90 font-medium">{entry.rank}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackerTable;