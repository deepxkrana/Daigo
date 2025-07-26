import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword as signInWithEmailAndPasswordFirebase,
  createUserWithEmailAndPassword as createUserWithEmailAndPasswordFirebase,
  sendEmailVerification as sendEmailVerificationFirebase,
  updateProfile as updateFirebaseProfile,
  User
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBClc6LdaZcHhyX0C_MX-1c1VfZ7ook8oU",
  authDomain: "daigo-f66e5.firebaseapp.com",
  projectId: "daigo-f66e5",
  storageBucket: "daigo-f66e5.firebasestorage.app",
  messagingSenderId: "849317270797",
  appId: "1:849317270797:web:1f14c22c9253346de80c44",
  measurementId: "G-SK5S75XZTQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account', // Forces account selection even when one account is available
});

// Google Sign-In function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info
    const user = result.user;
    return { user, token };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

// Email/Password Sign-In function
export const signInWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPasswordFirebase(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Email/Password Sign-In Error:', error);
    throw error;
  }
};

// Create User with Email/Password
// Email/Password Sign-Up function
export const createUserWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPasswordFirebase(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Email/Password Sign-Up Error:', error);
    throw error;
  }
};

// Send Email Verification
// Email verification function
export const sendEmailVerification = async (user: User) => {
  try {
    await sendEmailVerificationFirebase(user, {
      url: `${window.location.origin}/dashboard`,
    });
    return true;
  } catch (error) {
    console.error('Error sending email verification:', error);
    throw error;
  }
};

// Update User Profile
export const updateUserProfile = async (
  user: User, 
  profile: { 
    displayName?: string; 
    photoURL?: string 
  }
) => {
  try {
    await updateFirebaseProfile(user, profile);
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};