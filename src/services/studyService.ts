import { ref, set, get, push, update, remove, DataSnapshot } from 'firebase/database';
import { database } from '../firebaseConfig';
import { StudyEntry, StudyEntryBase } from '../types/StudyEntry';

export const saveStudyEntry = async (userId: string, entry: StudyEntryBase): Promise<string> => {
  try {
    const entryRef = push(ref(database, `users/${userId}/studyEntries`));
    const entryWithId = { ...entry, id: entryRef.key } as StudyEntry;
    await set(entryRef, entryWithId);
    return entryRef.key || '';
  } catch (error) {
    console.error('Error saving study entry:', error);
    throw error;
  }
};

export const updateStudyEntry = async (userId: string, entryId: string, updates: Partial<StudyEntry>): Promise<void> => {
  try {
    const entryRef = ref(database, `users/${userId}/studyEntries/${entryId}`);
    await update(entryRef, updates);
  } catch (error) {
    console.error('Error updating study entry:', error);
    throw error;
  }
};

export const deleteStudyEntry = async (userId: string, entryId: string): Promise<void> => {
  try {
    const entryRef = ref(database, `users/${userId}/studyEntries/${entryId}`);
    await remove(entryRef);
  } catch (error) {
    console.error('Error deleting study entry:', error);
    throw error;
  }
};

export const getStudyEntry = async (userId: string, entryId: string): Promise<StudyEntry | null> => {
  try {
    const snapshot = await get(ref(database, `users/${userId}/studyEntries/${entryId}`));
    return snapshot.exists() ? (snapshot.val() as StudyEntry) : null;
  } catch (error) {
    console.error('Error getting study entry:', error);
    throw error;
  }
};

export const getAllStudyEntries = async (userId: string): Promise<StudyEntry[]> => {
  try {
    const snapshot = await get(ref(database, `users/${userId}/studyEntries`));
    const entries: StudyEntry[] = [];
    
    snapshot.forEach((childSnapshot: DataSnapshot) => {
      entries.push(childSnapshot.val() as StudyEntry);
    });
    
    return entries;
  } catch (error) {
    console.error('Error getting all study entries:', error);
    throw error;
  }
};

// Helper function to calculate derived fields
const calculateDerivedFields = (entry: StudyEntryBase): Omit<StudyEntry, 'id'> => {
  const kdRatio = entry.deaths > 0 ? (entry.kills / entry.deaths) : entry.kills;
  const qph = entry.productiveHours > 0 ? (entry.questionseSolved / entry.productiveHours) : 0;
  
  // Simple rank calculation (you can customize this)
  let rank = 'Beginner';
  let rankEmoji = '👶';
  
  if (entry.totalHours > 100) {
    rank = 'Master';
    rankEmoji = '👑';
  } else if (entry.totalHours > 50) {
    rank = 'Advanced';
    rankEmoji = '💪';
  } else if (entry.totalHours > 20) {
    rank = 'Intermediate';
    rankEmoji = '🚀';
  }
  
  return {
    ...entry,
    kdRatio: parseFloat(kdRatio.toFixed(2)),
    qph: parseFloat(qph.toFixed(2)),
    rank,
    rankEmoji
  };
};

export const createStudyEntry = (data: StudyEntryBase): Omit<StudyEntry, 'id'> => {
  return calculateDerivedFields(data);
};
