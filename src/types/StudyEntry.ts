export interface StudyEntry {
  id: string;
  date: string;
  totalHours: number;
  productiveHours: number;
  questionseSolved: number;
  wastedTime: number;
  kills: number;
  deaths: number;
  kdRatio: number;
  qph: number;
  rank: string;
  rankEmoji: string;
}

export interface RankInfo {
  name: string;
  emoji: string;
  color: string;
  message: string;
}