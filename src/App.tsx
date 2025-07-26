import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Dashboard from './components/Dashboard';
import TrackerTable from './components/TrackerTable';
import Streak from './components/Streak';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { StudyEntry } from './types/StudyEntry';
import Navbar from './components/Navbar';

function App() {
  const [entries, setEntries] = useState<StudyEntry[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [_loading, setLoading] = useState(true);

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        // Load user-specific data when user is logged in
        const userId = user.uid;
        const savedEntries = localStorage.getItem(`studyEntries_${userId}`);
        if (savedEntries) {
          setEntries(JSON.parse(savedEntries));
        }
        
        const savedStreak = localStorage.getItem(`currentStreak_${userId}`);
        if (savedStreak) {
          setCurrentStreak(parseInt(savedStreak));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Save entries to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`studyEntries_${user.uid}`, JSON.stringify(entries));
    }
  }, [entries, user]);

  // Save streak to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`currentStreak_${user.uid}`, currentStreak.toString());
    }
  }, [currentStreak, user]);

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

  // Main app content with original styling
  const mainContent = (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      <Navbar />
      {/* Floating orbs for depth */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-purple-300 mb-4 tracking-tight">
            Daigo
          </h1>
          <p className="text-white/70 text-xl font-medium">Welcome back, {user?.displayName || 'User'}! Track your progress and boost your productivity.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Dashboard onAddEntry={addEntry} />
            <div className="mt-8">
              <TrackerTable entries={entries} />
            </div>
          </div>
          <div>
            <Streak streak={currentStreak} entries={entries} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {mainContent}
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;