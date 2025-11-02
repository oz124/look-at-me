# ⚡ מדריך פריסה מהיר ל-Ocean Digital

## 🎯 סיכום במשפט אחד
העלה את הקבצים לשרת, התקן dependencies, הפעל עם PM2, הגדר Nginx.

---

## 🚀 פריסה מהירה (5 דקות)

### 1️⃣ בנה את הפרויקט

```bash
npm run build:prod
```

### 2️⃣ העלה לשרת (אופציה A - אוטומטי)

**Windows PowerShell:**
```powershell
.\deploy-to-ocean.ps1 root@YOUR_SERVER_IP
```

**Linux/Mac:**
```bash
chmod +x deploy-to-ocean.sh
./deploy-to-ocean.sh root@YOUR_SERVER_IP
```

### 2️⃣ העלה לשרת (אופציה B - ידני)

**צור ארכיון:**
```bash
tar -czf deploy.tar.gz dist/ api/ models/ src/lib/ server.js package*.json ecosystem.config.js
```

**העלה:**
```bash
scp deploy.tar.gz root@YOUR_SERVER_IP:/var/www/lookatme/
```

**בשרת:**
```bash
cd /var/www/lookatme
tar -xzf deploy.tar.gz
npm install --production
pm2 start ecosystem.config.js --env production
pm2 save
```

---

## 🔧 הגדרת .env.local (פעם אחת)

בשרת, צור `.env.local`:

```bash
nano /var/www/lookatme/.env.local
```

מלא את הערכים הבאים (מינימום):

```env
NODE_ENV=production
PORT=3002

# חובה!
OPENAI_API_KEY=sk-proj-YOUR-KEY
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)

# Firebase (חובה לאימות)
VITE_FIREBASE_API_KEY=YOUR-KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456
VITE_FIREBASE_APP_ID=1:123456:web:abc
VITE_FIREBASE_MEASUREMENT_ID=G-XXX

# MongoDB (חובה לשמירת נתונים)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lookatme

# CORS (החלף בדומיין שלך!)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

שמור והגדר הרשאות:
```bash
chmod 600 .env.local
```

---

## 🌐 הגדרת Nginx (פעם אחת)

```bash
nano /etc/nginx/sites-available/lookatme
```

**תצורה מינימלית:**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/lookatme/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 100M;
}
```

הפעל:
```bash
ln -s /etc/nginx/sites-available/lookatme /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

הגדר SSL:
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## ✅ בדיקה מהירה

```bash
# בדוק PM2
pm2 status

# בדוק logs
pm2 logs lookatme --lines 20

# בדוק API
curl http://localhost:3002/api/health

# בדוק Nginx
systemctl status nginx
```

פתח דפדפן:
```
https://yourdomain.com
```

---

## 🔄 עדכון מהיר

כשיש שינויים בקוד:

```bash
# בנה מקומית
npm run build:prod

# העלה (בחר אופציה)
# אוטומטי:
.\deploy-to-ocean.ps1 root@YOUR_SERVER_IP

# או ידני:
scp -r dist/ root@YOUR_SERVER_IP:/var/www/lookatme/
ssh root@YOUR_SERVER_IP "pm2 restart lookatme"
```

---

## 🐛 פתרון בעיות מהיר

### PM2 לא רץ
```bash
cd /var/www/lookatme
pm2 start server.js --name lookatme
pm2 save
```

### שגיאת CORS
```bash
# בדוק .env.local
cat .env.local | grep ALLOWED_ORIGINS
# החלף בדומיין שלך:
nano .env.local  # ערוך ALLOWED_ORIGINS
pm2 restart lookatme
```

### שגיאת MongoDB
```bash
# בדוק connection
cat .env.local | grep MONGODB_URI
# MongoDB Atlas > Network Access > הוסף IP השרת
```

### Nginx 502
```bash
# בדוק שPM2 רץ
pm2 status
# אם לא - הפעל
pm2 start lookatme
```

---

## 📊 פקודות שימושיות

```bash
# PM2
pm2 status                  # סטטוס
pm2 logs lookatme          # לוגים
pm2 restart lookatme       # אתחול
pm2 monit                  # ניטור real-time

# Nginx
systemctl status nginx     # סטטוס
systemctl reload nginx     # טען מחדש
nginx -t                   # בדיקת תצורה
tail -f /var/log/nginx/error.log  # לוגים

# System
htop                       # ניטור משאבים
df -h                      # שימוש בדיסק
free -m                    # שימוש ב-RAM
```

---

## 📁 מבנה תיקיות בשרת

```
/var/www/lookatme/
├── dist/              # Frontend (React build)
├── api/               # Backend API routes
├── models/            # Database models
├── src/lib/           # Shared libraries
├── server.js          # Express server
├── package.json       # Dependencies
├── ecosystem.config.js # PM2 config
├── .env.local         # Environment variables (⚠️ SECRET!)
└── logs/              # Application logs
```

---

## 🎯 Checklist קצר

לפני שמפרסמים ב-production:

- [ ] `npm run build:prod` עובד
- [ ] `.env.local` במקום עם כל המפתחות
- [ ] `ALLOWED_ORIGINS` מוגדר לדומיין שלך
- [ ] MongoDB IP whitelist כולל את השרת
- [ ] Firebase Authorized Domains כולל את הדומיין
- [ ] PM2 רץ: `pm2 status`
- [ ] Nginx מוגדר ורץ
- [ ] SSL פעיל (HTTPS)
- [ ] Login עובד
- [ ] Upload עובד

---

## 🆘 תמיכה מהירה

**לוגים:**
```bash
pm2 logs lookatme --lines 50
```

**אתחול מלא:**
```bash
pm2 restart lookatme
systemctl reload nginx
```

**בדיקת בריאות:**
```bash
curl http://localhost:3002/api/health
```

---

**לפרטים נוספים:** ראה `OCEAN_DIGITAL_DEPLOY.md`

