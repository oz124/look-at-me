# 🔒 Deployment Security Checklist - Look At Me

## ✅ Pre-Deployment Checklist

השתמש ברשימה הזו לפני כל deploy לפרודקשן כדי לוודא שהאבטחה במקום!

---

## 🔴 קריטי - חובה לבדוק!

### 1. Environment Variables (סביבת עבודה)

```bash
# בדוק שיש לך קובץ .env.local על השרת עם כל המשתנים הבאים:
```

- [ ] `NODE_ENV=production` - מוגדר כראוי
- [ ] `JWT_SECRET` - לפחות 32 תווים, חזק ורנדומלי
- [ ] `ENCRYPTION_KEY` - לפחות 32 תווים, חזק ורנדומלי
- [ ] `SESSION_SECRET` - לפחות 32 תווים, חזק ורנדומלי
- [ ] `OPENAI_API_KEY` - מפתח אמיתי מ-OpenAI
- [ ] `MONGODB_URI` - connection string מלא ותקין
- [ ] `ALLOWED_ORIGINS` - כולל את כל הדומיינים שלך בפרודקשן

**בדיקה מהירה:**
```bash
# בשרת, הרץ:
cat .env.local | grep -E "JWT_SECRET|ENCRYPTION_KEY|SESSION_SECRET" | wc -l
# צריך להחזיר: 3
```

---

### 2. Firebase Configuration (Firebase)

- [ ] כל המשתנים `VITE_FIREBASE_*` מוגדרים ב-.env.local
- [ ] Firebase Console > Authentication > Sign-in method:
  - [ ] Email/Password מופעל
  - [ ] Google מופעל (אופציונלי)
  - [ ] Facebook מופעל (אופציונלי)
- [ ] Firebase Console > Authentication > Settings > Authorized domains:
  - [ ] הדומיין שלך מוסף (לדוגמה: `lookatme.site`)
- [ ] Firestore Security Rules מוגדרים (ראה `FIREBASE_SETUP_INSTRUCTIONS.md`)

**בדיקה:**
```bash
# נסה להתחבר דרך הדפדפן ובדוק שאין שגיאות ב-Console
```

---

### 3. MongoDB Security (מסד נתונים)

- [ ] MongoDB Atlas > Network Access > IP Whitelist:
  - [ ] כתובת ה-IP של השרת מוספת
  - [ ] אם אתה משתמש ב-Load Balancer, הוסף גם את ה-IP שלו
- [ ] Connection string תקין ועובד
- [ ] Database user יש לו הרשאות מתאימות (readWrite)

**בדיקה:**
```bash
# בשרת, הרץ (אם יש לך mongosh):
mongosh "YOUR_MONGODB_URI" --eval "db.adminCommand('ping')"
# צריך להחזיר: { ok: 1 }
```

---

### 4. HTTPS & SSL (אבטחת תעבורה)

- [ ] HTTPS מופעל על השרת
- [ ] SSL Certificate תקף (Let's Encrypt / Cloudflare)
- [ ] אין mixed content warnings (כל הקישורים HTTPS)
- [ ] HTTP מפנה אוטומטית ל-HTTPS

**בדיקה:**
```bash
# בדוק שה-SSL תקין:
curl -I https://lookatme.site
# צריך להחזיר: HTTP/2 200
```

---

### 5. CORS Configuration (אבטחת API)

- [ ] `ALLOWED_ORIGINS` ב-.env.local כולל את כל הדומיינים
- [ ] אין dומיינים מיותרים (למשל: localhost בפרודקשן)
- [ ] פורמט נכון: `https://domain1.com,https://domain2.com` (ללא רווחים!)

**בדיקה:**
```bash
# בדוק שהשרת מחזיר CORS headers נכונים:
curl -H "Origin: https://lookatme.site" -I https://your-api-domain.com/api/health
# צריך להחזיר: Access-Control-Allow-Origin: https://lookatme.site
```

---

### 6. Debug Mode (מצב בדיקה)

- [ ] `DEBUG_MODE` בקוד הוא **environment-based** (לא hardcoded `true`)
- [ ] כשעושים `npm run build`, DEBUG_MODE אוטומטית יהיה `false`

**בדיקה:**
```bash
# וודא שהקוד כולל:
grep "import.meta.env.DEV" src/pages/Campaign.tsx
# צריך להחזיר: const DEBUG_MODE = import.meta.env.DEV;
```

---

### 7. File Permissions (הרשאות קבצים)

- [ ] `.env.local` על השרת יש הרשאות 600 (רק owner יכול לקרוא)
- [ ] אין קבצי `.env` ב-git repository

**בדיקה בשרת:**
```bash
ls -la .env.local
# צריך להראות: -rw------- (600)

# אם לא, תקן:
chmod 600 .env.local
```

---

## 🟡 מומלץ מאוד

### 8. Dependencies Security (תלויות)

- [ ] הרץ `npm audit` ותקן vulnerabilities
- [ ] הרץ `npm outdated` ושקול עדכון חבילות

**בדיקה:**
```bash
npm audit
# תקן אם יש בעיות:
npm audit fix
```

---

### 9. Social Media Platform Secrets (מפתחות רשתות חברתיות)

- [ ] `FACEBOOK_APP_SECRET` - סודי, לא VITE_*
- [ ] `GOOGLE_CLIENT_SECRET` - סודי, לא VITE_*
- [ ] `TIKTOK_CLIENT_SECRET` - סודי, לא VITE_*

**שים לב:** רק `VITE_*` משתנים בטוחים לחשיפה (frontend). כל השאר חייבים להישאר SECRET בbackend!

---

### 10. Rate Limiting (הגבלת קצב)

- [ ] Rate limits מוגדרים על כל ה-endpoints
- [ ] Global rate limit: 100 requests/15min
- [ ] Expensive endpoints (AI, Video): 5-10 requests/15min

**בדיקה:**
```bash
# נסה לעשות 10 בקשות מהירות:
for i in {1..10}; do curl https://your-domain.com/api/health; done
# אם עובדת - הגבלת הקצב עובדת!
```

---

### 11. Logging & Monitoring (ניטור)

- [ ] PM2 או process manager אחר מותקן
- [ ] Logs נשמרים ונגישים
- [ ] Error tracking מוגדר (אופציונלי: Sentry, Loggly)

**בדיקה:**
```bash
# אם משתמש ב-PM2:
pm2 logs
pm2 status
```

---

## 🟢 נחמד לעשות (אך לא קריטי)

### 12. Backup & Recovery (גיבוי)

- [ ] MongoDB backups אוטומטיים מוגדרים (MongoDB Atlas עושה זאת אוטומטית)
- [ ] יש לך עותק של .env.local במקום בטוח (לא ב-git!)

---

### 13. Performance

- [ ] Gzip compression מופעל
- [ ] Static files ממוקמים ב-CDN (אופציונלי)
- [ ] Database indexes מוגדרים (כבר קיימים ב-Campaign.js ו-User.js)

---

### 14. Testing

- [ ] בדוק signup/login בפרודקשן
- [ ] בדוק העלאת סרטון וניתוח AI
- [ ] בדוק חיבור לפלטפורמות (Facebook/Google/TikTok)
- [ ] בדוק יצירת קמפיין בפועל

---

## 📋 Quick Pre-Deploy Command

הרץ את זה לפני כל deploy:

```bash
# סקריפט בדיקה מהיר
echo "🔍 בודק אבטחה..."

# 1. בדוק שאין .env files ב-git
if git ls-files | grep -q "\.env"; then
  echo "❌ יש קבצי .env ב-git! הסר אותם מיד!"
  exit 1
fi

# 2. בדוק ש-DEBUG_MODE תקין
if grep -q "DEBUG_MODE = true" src/pages/Campaign.tsx; then
  echo "⚠️  DEBUG_MODE hardcoded to true! תתקן ל-import.meta.env.DEV"
  exit 1
fi

# 3. בדוק vulnerabilities
npm audit --audit-level=high
if [ $? -ne 0 ]; then
  echo "⚠️  יש vulnerabilities! הרץ: npm audit fix"
fi

# 4. Build test
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build נכשל!"
  exit 1
fi

echo "✅ כל הבדיקות עברו בהצלחה!"
```

---

## 🚀 Deployment Steps (צעדי Deploy)

1. **הכן את הסביבה:**
   ```bash
   # בשרת:
   cp PRODUCTION_ENV_TEMPLATE.txt .env.local
   nano .env.local  # ערוך ומלא את כל הערכים
   chmod 600 .env.local
   ```

2. **בנה את הפרויקט:**
   ```bash
   # מקומית:
   npm run build:prod
   ```

3. **העלה לשרת:**
   ```bash
   # העלה את dist/ ואת server.js
   scp -r dist/ user@server:/path/to/app/
   scp server.js user@server:/path/to/app/
   scp -r api/ user@server:/path/to/app/
   scp -r models/ user@server:/path/to/app/
   scp -r src/lib/ user@server:/path/to/app/src/
   ```

4. **הפעל בשרת:**
   ```bash
   # בשרת:
   cd /path/to/app
   npm install --production
   pm2 restart all
   # או:
   pm2 start server.js --name lookatme
   ```

5. **בדוק שהכל עובד:**
   ```bash
   curl https://lookatme.site/api/health
   # צריך להחזיר: {"status":"ok"}
   ```

---

## 🆘 אם משהו לא עובד

### שגיאת CORS
```
Access to fetch at 'https://api...' from origin 'https://...' has been blocked by CORS
```
**פתרון:** וודא ש-`ALLOWED_ORIGINS` כולל את הדומיין, ללא רווחים, עם `https://`

---

### שגיאת MongoDB Connection
```
MongoServerError: bad auth
```
**פתרון:** 
1. בדוק ש-IP של השרת ב-whitelist (MongoDB Atlas > Network Access)
2. בדוק username/password ב-connection string

---

### שגיאת Firebase Auth
```
Firebase: Error (auth/unauthorized-domain)
```
**פתרון:** Firebase Console > Authentication > Settings > Authorized domains → הוסף את הדומיין שלך

---

### DEBUG_MODE עדיין true בפרודקשן
**פתרון:** 
```bash
# וודא שבנית עם:
npm run build:prod
# ולא:
npm run build  # זה development build!
```

---

## 📞 תמיכה

אם יש בעיות:
1. בדוק logs: `pm2 logs`
2. בדוק browser console לשגיאות frontend
3. בדוק server logs לשגיאות backend
4. עיין ב-`FIREBASE_SETUP_INSTRUCTIONS.md` להגדרות Firebase

---

## ✅ סיכום מהיר

לפני deploy, וודא:
- ✅ .env.local מלא ותקין
- ✅ HTTPS עובד
- ✅ Firebase Authorized Domains
- ✅ MongoDB IP Whitelist
- ✅ CORS ALLOWED_ORIGINS
- ✅ DEBUG_MODE environment-based
- ✅ npm run build:prod עובד
- ✅ אין .env files ב-git

**אחרי Deploy:**
- ✅ Login עובד
- ✅ Upload video עובד
- ✅ AI analysis עובד
- ✅ Campaign creation עובד

🎉 **מזל טוב! האפליקציה מאובטחת ומוכנה!**

