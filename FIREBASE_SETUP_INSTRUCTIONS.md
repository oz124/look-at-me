# 🔥 הוראות הגדרת Firebase

## 📋 שלבי ההתקנה

### 1. יצירת פרויקט Firebase

1. כנס ל-[Firebase Console](https://console.firebase.google.com)
2. לחץ על **"Add project"** או **"הוסף פרויקט"**
3. תן שם לפרויקט: `look-at-me-marketing`
4. (אופציונלי) הפעל Google Analytics
5. לחץ על **"Create project"**

### 2. הפעלת Authentication

1. בתפריט הצד, לחץ על **"Authentication"**
2. לחץ על **"Get started"**
3. בטאב **"Sign-in method"**, הפעל:
   - ✅ **Email/Password** - לחץ Enable
   - ✅ **Google** - לחץ Enable והוסף את פרטי הפרויקט

### 3. יצירת Firestore Database

1. בתפריט הצד, לחץ על **"Firestore Database"**
2. לחץ על **"Create database"**
3. בחר **"Start in production mode"** (נוסיף Rules אחר כך)
4. בחר **Location**: `europe-west1` (אירופה - הכי קרוב לישראל)
5. לחץ על **"Enable"**

### 4. הגדרת Security Rules

בכרטיסייה **"Rules"** ב-Firestore, החלף את הקוד עם:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - each user can only read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow user to check their own subscription limits
      allow get: if request.auth != null && request.auth.uid == userId;
    }
    
    // Campaigns collection - users can only access their own campaigns
    match /campaigns/{campaignId} {
      allow read, write: if request.auth != null && 
                          resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // Analytics collection - read only for authenticated users
    match /analytics/{document=**} {
      allow read: if request.auth != null;
      allow write: if false; // Only server can write
    }
  }
}
\`\`\`

לחץ על **"Publish"**

### 5. קבלת פרטי ההגדרה

1. בתפריט הצד, לחץ על ⚙️ **"Project settings"**
2. גלול למטה ל-**"Your apps"**
3. לחץ על **"Web"** (</>) אייקון
4. תן שם לאפליקציה: `Look At Me Web`
5. אל תסמן "Firebase Hosting" (לא צריך כרגע)
6. לחץ על **"Register app"**

7. העתק את כל פרטי ההגדרה:
   ```javascript
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "...",
     measurementId: "..."
   };
   ```

### 6. יצירת קובץ .env

1. צור קובץ בשם `.env` בשורש הפרויקט
2. העתק את התוכן מ-`.env.example`
3. מלא את הערכים מפרטי ההגדרה של Firebase:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=look-at-me-marketing.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=look-at-me-marketing
VITE_FIREBASE_STORAGE_BUCKET=look-at-me-marketing.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123
```

### 7. הרצת הפרויקט

```bash
npm install
npm run dev
```

## 🎉 זהו! המערכת מוכנה!

עכשיו תוכל:
- ✅ להירשם עם אימייל וסיסמה
- ✅ להתחבר עם Google
- ✅ לנהל מנויים והגבלות
- ✅ לשמור נתוני משתמשים ב-Firestore

---

## 📊 מבנה הנתונים ב-Firestore

### Collection: `users`
```javascript
{
  uid: string,
  email: string,
  name: string,
  phone: string,
  
  subscription: {
    plan: 'free' | 'regular' | 'unlimited',
    status: 'active' | 'inactive' | 'cancelled' | 'expired',
    startDate: Date,
    endDate: Date,
    price: number,
    billingCycle: 'free' | 'monthly' | 'yearly'
  },
  
  usage: {
    analysesCount: number,
    analysesLimit: number,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    lastAnalysisDate: Date
  },
  
  connectedPlatforms: {
    facebook: { connected: boolean, ... },
    google: { connected: boolean, ... },
    tiktok: { connected: boolean, ... }
  },
  
  settings: {
    language: 'hebrew' | 'english',
    notifications: { ... },
    timezone: string
  },
  
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

---

## 🔐 אבטחה

- ✅ כל משתמש יכול לגשת רק לנתונים שלו
- ✅ סיסמאות מוצפנות אוטומטית ע"י Firebase
- ✅ JWT tokens לאימות
- ✅ Security Rules מונעות גישה לא מורשית

---

## 💡 טיפים

1. **אימות מייל**: משתמשים יקבלו מייל אימות לאחר רישום
2. **שחזור סיסמה**: ניתן להוסיף דף שחזור סיסמה
3. **מנויים**: הגבלות מתעדכנות אוטומטית
4. **גיבוי**: Firebase מגבה אוטומטית את הנתונים

---

## 🆘 תמיכה

אם יש בעיות:
1. בדוק ש-`.env` קיים ומכיל את כל המפתחות
2. וודא שהפעלת Authentication ו-Firestore
3. בדוק את Security Rules
4. הסתכל ב-Console של הדפדפן לשגיאות

**Firebase Documentation**: https://firebase.google.com/docs

