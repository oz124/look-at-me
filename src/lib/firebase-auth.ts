import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase-config';

// Subscription Plans Configuration
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free Trial',
    nameHe: 'ניסיון חינם',
    price: 0,
    priceUSD: 0,
    analysesLimit: 3,
    features: {
      basicFeatures: true,
      allPlatforms: true,
      support: 'basic'
    }
  },
  regular: {
    name: 'Regular Plan',
    nameHe: 'מנוי רגיל',
    price: 79,
    priceUSD: 21,
    analysesLimit: 30,
    features: {
      basicFeatures: true,
      allPlatforms: true,
      support: 'full',
      analytics: true
    }
  },
  unlimited: {
    name: 'Unlimited Plan',
    nameHe: 'מנוי ללא הגבלה',
    price: 129,
    priceUSD: 34,
    analysesLimit: -1, // -1 = unlimited
    features: {
      basicFeatures: true,
      allPlatforms: true,
      support: 'priority',
      analytics: true,
      advancedFeatures: true,
      earlyAccess: true
    }
  }
} as const;

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS;

// User data structure in Firestore
export interface UserData {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  
  // Subscription
  subscription: {
    plan: SubscriptionPlan;
    status: 'active' | 'inactive' | 'cancelled' | 'expired';
    startDate: Date;
    endDate: Date;
    price: number;
    billingCycle: 'free' | 'monthly' | 'yearly';
  };
  
  // Usage tracking
  usage: {
    analysesCount: number;
    analysesLimit: number;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    lastAnalysisDate?: Date;
  };
  
  // Connected platforms
  connectedPlatforms: {
    facebook: {
      connected: boolean;
      accessToken?: string;
      pageId?: string;
      accountId?: string;
      connectedAt?: Date;
    };
    google: {
      connected: boolean;
      accessToken?: string;
      refreshToken?: string;
      customerId?: string;
      connectedAt?: Date;
    };
    tiktok: {
      connected: boolean;
      accessToken?: string;
      advertiserIds?: string[];
      connectedAt?: Date;
    };
  };
  
  // Settings
  settings: {
    language: 'hebrew' | 'english';
    notifications: {
      email: boolean;
      campaignUpdates: boolean;
      billingAlerts: boolean;
    };
    timezone: string;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

// Create initial user data
const createInitialUserData = (user: FirebaseUser, name: string, phone?: string): UserData => {
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);
  
  const subscriptionEnd = new Date(now);
  subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1); // Free for 1 year
  
  return {
    uid: user.uid,
    email: user.email || '',
    name,
    ...(phone && { phone }), // Only include phone if it exists
    
    subscription: {
      plan: 'free',
      status: 'active',
      startDate: now,
      endDate: subscriptionEnd,
      price: 0,
      billingCycle: 'free'
    },
    
    usage: {
      analysesCount: 0,
      analysesLimit: 3,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd
    },
    
    connectedPlatforms: {
      facebook: { connected: false },
      google: { connected: false },
      tiktok: { connected: false }
    },
    
    settings: {
      language: 'hebrew',
      notifications: {
        email: true,
        campaignUpdates: true,
        billingAlerts: true
      },
      timezone: 'Asia/Jerusalem'
    },
    
    createdAt: now,
    updatedAt: now,
    lastLogin: now
  };
};

// Register new user
export const registerUser = async (
  email: string,
  password: string,
  name: string,
  phone?: string
): Promise<{ user: FirebaseUser; userData: UserData }> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with name
    await updateProfile(user, { displayName: name });
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Create user document in Firestore
    const userData = createInitialUserData(user, name, phone);
    await setDoc(doc(db, 'users', user.uid), userData);
    
    return { user, userData };
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Login user
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: FirebaseUser; userData: UserData }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update last login
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Get user data
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() as UserData;
    
    return { user, userData };
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Login with Google
export const loginWithGoogle = async (): Promise<{ user: FirebaseUser; userData: UserData }> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Check if user exists in Firestore
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create new user document
      const userData = createInitialUserData(user, user.displayName || 'User');
      await setDoc(userRef, userData);
      return { user, userData };
    } else {
      // Update last login
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const userData = userDoc.data() as UserData;
      return { user, userData };
    }
  } catch (error: any) {
    console.error('Google login error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Login with Facebook
export const loginWithFacebook = async (): Promise<{ user: FirebaseUser; userData: UserData }> => {
  try {
    const provider = new FacebookAuthProvider();
    // Request additional permissions
    provider.addScope('email');
    provider.addScope('public_profile');
    
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Check if user exists in Firestore
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create new user document
      const userData = createInitialUserData(user, user.displayName || 'User');
      await setDoc(userRef, userData);
      return { user, userData };
    } else {
      // Update last login
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const userData = userDoc.data() as UserData;
      return { user, userData };
    }
  } catch (error: any) {
    console.error('Facebook login error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error('שגיאה בהתנתקות');
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Check if user can analyze (based on plan and usage)
export const canUserAnalyze = (userData: UserData): { allowed: boolean; reason?: string } => {
  const now = new Date();
  
  // Check subscription status
  if (userData.subscription.status !== 'active') {
    return { allowed: false, reason: 'subscription_inactive' };
  }
  
  // Check if subscription expired
  if (new Date(userData.subscription.endDate) < now) {
    return { allowed: false, reason: 'subscription_expired' };
  }
  
  // Reset period if needed
  if (new Date(userData.usage.currentPeriodEnd) < now) {
    // Period expired, will be reset on next analysis
    return { allowed: true };
  }
  
  // Unlimited plan
  if (userData.subscription.plan === 'unlimited') {
    return { allowed: true };
  }
  
  // Check usage limits
  if (userData.usage.analysesCount >= userData.usage.analysesLimit) {
    return {
      allowed: false,
      reason: 'limit_reached'
    };
  }
  
  return { allowed: true };
};

// Increment analysis count
export const incrementAnalysisCount = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data() as UserData;
    const now = new Date();
    
    // Check if period expired and reset
    if (new Date(userData.usage.currentPeriodEnd) < now) {
      const newPeriodEnd = new Date(now);
      newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);
      
      await updateDoc(userRef, {
        'usage.analysesCount': 1,
        'usage.currentPeriodStart': now,
        'usage.currentPeriodEnd': newPeriodEnd,
        'usage.lastAnalysisDate': now,
        updatedAt: serverTimestamp()
      });
    } else {
      // Increment count
      await updateDoc(userRef, {
        'usage.analysesCount': userData.usage.analysesCount + 1,
        'usage.lastAnalysisDate': now,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error incrementing analysis count:', error);
    throw error;
  }
};

// Upgrade subscription
export const upgradeSubscription = async (
  uid: string,
  plan: SubscriptionPlan,
  billingCycle: 'monthly' | 'yearly'
): Promise<void> => {
  try {
    const planDetails = SUBSCRIPTION_PLANS[plan];
    const now = new Date();
    const endDate = new Date(now);
    
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      'subscription.plan': plan,
      'subscription.status': 'active',
      'subscription.startDate': now,
      'subscription.endDate': endDate,
      'subscription.price': planDetails.price,
      'subscription.billingCycle': billingCycle,
      'usage.analysesLimit': planDetails.analysesLimit,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    throw error;
  }
};

// Error messages translation
const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': 'כתובת האימייל כבר בשימוש',
    'auth/invalid-email': 'כתובת אימייל לא תקינה',
    'auth/operation-not-allowed': 'הפעולה לא מורשית',
    'auth/weak-password': 'הסיסמה חלשה מדי (מינימום 6 תווים)',
    'auth/user-disabled': 'החשבון הושעה',
    'auth/user-not-found': 'משתמש לא נמצא',
    'auth/wrong-password': 'סיסמה שגויה',
    'auth/too-many-requests': 'יותר מדי ניסיונות. נסה שוב מאוחר יותר',
    'auth/network-request-failed': 'שגיאת רשת. בדוק את החיבור לאינטרנט',
    'auth/popup-closed-by-user': 'החלון נסגר על ידי המשתמש'
  };
  
  return errorMessages[errorCode] || 'שגיאה לא צפויה. נסה שוב';
};

