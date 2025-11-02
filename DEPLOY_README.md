# 🌊 Look At Me - מדריך פריסה ל-Ocean Digital

## 📝 סיכום

פרויקט זה מוכן לפריסה מלאה ב-Ocean Digital עם:
- ✅ React Frontend מבוסס Vite
- ✅ Express Backend עם אבטחה מלאה
- ✅ Firebase Authentication
- ✅ MongoDB Integration
- ✅ OpenAI API Integration
- ✅ PM2 Process Management
- ✅ Nginx Reverse Proxy Configuration
- ✅ SSL/HTTPS Support

---

## 🚀 שיטות פריסה (בחר אחת)

### שיטה 1: פריסה אוטומטית (מומלץ)

**Windows:**
```powershell
# בנה + הכן חבילה
npm run deploy:ocean

# העלה באמצעות הסקריפט
.\deploy-to-ocean.ps1 root@YOUR_SERVER_IP
```

**Linux/Mac:**
```bash
# בנה + הכן חבילה
npm run deploy:ocean

# העלה באמצעות הסקריפט
chmod +x deploy-to-ocean.sh
./deploy-to-ocean.sh root@YOUR_SERVER_IP
```

### שיטה 2: פריסה ידנית מהירה

```bash
# 1. בנה את הפרויקט
npm run build:prod

# 2. צור חבילת פריסה
npm run deploy:package

# 3. העלה לשרת
scp lookatme-deploy-*.tar.gz root@YOUR_SERVER_IP:/tmp/

# 4. פרוס בשרת
ssh root@YOUR_SERVER_IP
cd /var/www/lookatme
tar -xzf /tmp/lookatme-deploy-*.tar.gz
npm install --production
pm2 restart lookatme
```

### שיטה 3: דרך Git (לפרודקשן מתמשך)

```bash
# בשרת
cd /var/www/lookatme
git pull origin main
npm install --production
npm run build:prod
pm2 restart lookatme
```

---

## 📋 דרישות מוקדמות

### בשרת (Ocean Digital Droplet)

**מומלץ:** Droplet של $12/חודש (2GB RAM, Ubuntu 22.04)

התקן את הדברים הבאים:

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# PM2
npm install -g pm2

# Nginx
apt install -y nginx

# Certbot (SSL)
apt install -y certbot python3-certbot-nginx
```

### שירותים חיצוניים

1. **MongoDB Atlas:**
   - צור cluster חינמי ב-https://cloud.mongodb.com
   - קבל connection string
   - הוסף את IP השרת ל-whitelist

2. **Firebase:**
   - צור project ב-https://console.firebase.google.com
   - הפעל Authentication (Email/Password)
   - קבל את הקונפיגורציה
   - הוסף את הדומיין שלך ל-Authorized Domains

3. **OpenAI:**
   - קבל API key מ-https://platform.openai.com/api-keys
   - הפעל billing (צריך כרטיס אשראי)

---

## ⚙️ הגדרת השרת (פעם אחת)

### 1. הכן תיקיית פרויקט

```bash
mkdir -p /var/www/lookatme
cd /var/www/lookatme
```

### 2. צור .env.local

```bash
nano .env.local
```

העתק את התוכן מ-`PRODUCTION_ENV_TEMPLATE.txt` ומלא:

```env
NODE_ENV=production
PORT=3002

# Security Keys - צור עם: openssl rand -base64 32
JWT_SECRET=YOUR_GENERATED_SECRET_32_CHARS_MIN
ENCRYPTION_KEY=YOUR_GENERATED_SECRET_32_CHARS_MIN
SESSION_SECRET=YOUR_GENERATED_SECRET_32_CHARS_MIN

# OpenAI
OPENAI_API_KEY=sk-proj-YOUR-KEY-HERE

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/lookatme?retryWrites=true&w=majority

# Firebase (מFirebase Console)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# CORS - הדומיין שלך!
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# אופציונלי - רשתות חברתיות
VITE_FACEBOOK_APP_ID=your-app-id
FACEBOOK_APP_SECRET=your-secret
VITE_GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
VITE_TIKTOK_CLIENT_KEY=your-key
TIKTOK_CLIENT_SECRET=your-secret
```

הגן על הקובץ:
```bash
chmod 600 .env.local
```

### 3. הגדר Nginx

```bash
nano /etc/nginx/sites-available/lookatme
```

ראה את הקובץ המלא ב-`nginx.conf.example` או השתמש בזה:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL (יוגדר ע"י Certbot)
    
    location / {
        root /var/www/lookatme/dist;
        try_files $uri $uri/ /index.html;
    }

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

### 4. הגדר SSL

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 5. הגדר Firewall

```bash
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

---

## 🔧 פריסה ראשונית

לאחר הכנת השרת, פרוס בפעם הראשונה:

```bash
# 1. העלה קבצים (בחר שיטה מלמעלה)

# 2. התקן dependencies בשרת
cd /var/www/lookatme
npm install --production

# 3. צור תיקיית logs
mkdir -p logs

# 4. הפעל עם PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup  # הרץ את הפקודה שמוצגת

# 5. בדוק סטטוס
pm2 status
pm2 logs lookatme --lines 20
```

---

## ✅ בדיקות

### בדיקה לפני פריסה (במחשב המקומי)

```bash
npm run deploy:quick-check
```

### בדיקה בשרת

```bash
# בשרת
pm2 status
pm2 logs lookatme --lines 50
curl http://localhost:3002/api/health

# מהדפדפן
https://yourdomain.com
https://yourdomain.com/api/health
```

### בדיקת פונקציונליות

1. ✅ Login/Signup עובד
2. ✅ Upload video עובד
3. ✅ AI analysis עובד
4. ✅ Campaign creation עובד
5. ✅ Analytics מוצגים

---

## 🔄 עדכונים עתידיים

כשיש שינויים בקוד:

```bash
# במחשב המקומי
npm run build:prod

# העלה (בחר שיטה)
# אוטומטי:
.\deploy-to-ocean.ps1 root@YOUR_SERVER_IP

# או ידני:
npm run deploy:package
scp lookatme-deploy-*.tar.gz root@SERVER:/tmp/
ssh root@SERVER "cd /var/www/lookatme && tar -xzf /tmp/lookatme-deploy-*.tar.gz && pm2 restart lookatme"
```

---

## 📚 מסמכי עזר

- **מדריך מפורט:** `OCEAN_DIGITAL_DEPLOY.md`
- **מדריך מהיר:** `QUICK_DEPLOY_GUIDE.md`
- **בדיקות אבטחה:** `DEPLOYMENT_SECURITY_CHECKLIST.md`
- **Firebase:** `FIREBASE_SETUP_INSTRUCTIONS.md`
- **Environment variables:** `PRODUCTION_ENV_TEMPLATE.txt`
- **Nginx config:** `nginx.conf.example`

---

## 🛠️ פקודות שימושיות

### PM2

```bash
pm2 status                  # סטטוס כל התהליכים
pm2 logs lookatme          # לוגים בזמן אמת
pm2 logs lookatme --lines 50 # 50 שורות אחרונות
pm2 restart lookatme       # אתחול
pm2 stop lookatme          # עצירה
pm2 monit                  # ניטור real-time
pm2 save                   # שמירת תצורה
```

### Nginx

```bash
systemctl status nginx     # סטטוס
systemctl reload nginx     # טען מחדש תצורה
systemctl restart nginx    # אתחול מלא
nginx -t                   # בדיקת תקינות תצורה
tail -f /var/log/nginx/error.log  # לוגי שגיאות
```

### System

```bash
htop                       # ניטור משאבים
df -h                      # שימוש בדיסק
free -m                    # שימוש ב-RAM
netstat -tulpn | grep 3002 # בדיקת פורט
```

---

## 🐛 פתרון בעיות

### PM2 לא רץ

```bash
cd /var/www/lookatme
pm2 start server.js --name lookatme --env production
pm2 save
```

### שגיאת CORS

```bash
# בדוק .env.local
nano /var/www/lookatme/.env.local
# וודא: ALLOWED_ORIGINS=https://yourdomain.com
pm2 restart lookatme
```

### MongoDB Connection Error

1. MongoDB Atlas > Network Access > Add current IP
2. בדוק connection string ב-.env.local
3. אתחל: `pm2 restart lookatme`

### Nginx 502 Bad Gateway

```bash
# בדוק שPM2 רץ
pm2 status
# אם לא - הפעל
pm2 start lookatme
# בדוק לוגים
tail -f /var/log/nginx/error.log
```

### Firebase Auth Error

1. Firebase Console > Authentication > Settings > Authorized domains
2. הוסף את הדומיין שלך
3. חכה 5-10 דקות

---

## 📊 מבנה הפרויקט

```
/var/www/lookatme/
├── dist/                      # Frontend build
│   ├── index.html
│   └── assets/
├── api/                       # Backend API routes
│   ├── ai/
│   ├── campaigns/
│   └── platforms/
├── models/                    # MongoDB models
│   ├── Campaign.js
│   └── User.js
├── src/lib/                   # Shared libraries
│   ├── security.js
│   ├── data-encryption.js
│   └── ...
├── server.js                  # Main server
├── ecosystem.config.js        # PM2 config
├── package.json
├── .env.local                 # ⚠️ SECRET - not in git!
└── logs/                      # Application logs
```

---

## 💰 אופטימיזציה לעלויות

### Droplet Size

- **התחלה:** $12/חודש (2GB RAM) - מספיק ל-50-100 users
- **צמיחה:** $24/חודש (4GB RAM) - מספיק ל-500+ users

### חיסכון נוסף

- Automated Backups: $2.4/חודש (מומלץ מאוד!)
- Monitoring: השתמש ב-PM2 (חינם) במקום New Relic
- CDN: Cloudflare (חינם) לתמונות וסטטיקה

---

## 🔐 אבטחה

### Checklist אבטחה

- [x] HTTPS (SSL) מופעל
- [x] Firewall (UFW) מוגדר
- [x] `.env.local` עם הרשאות 600
- [x] Secrets חזקים (32+ תווים)
- [x] MongoDB IP whitelist
- [x] Firebase Authorized Domains
- [x] Rate limiting מופעל
- [x] Helmet.js security headers
- [x] CORS מוגדר נכון
- [x] `NODE_ENV=production`

### עדכוני אבטחה

```bash
# בשרת, כל חודש:
npm audit
npm audit fix
pm2 restart lookatme
```

---

## 📞 תמיכה

אם יש בעיות:

1. **בדוק logs:** `pm2 logs lookatme --lines 100`
2. **בדוק system logs:** `journalctl -xe`
3. **בדוק Nginx logs:** `tail -f /var/log/nginx/error.log`
4. **בדוק browser console:** F12 > Console

---

## 🎉 סיכום

הפרויקט מוכן לפריסה ב-Ocean Digital עם:

✅ Build אוטומטי מאופטם  
✅ סקריפטים לפריסה אוטומטית  
✅ תצורת PM2 מוכנה  
✅ תצורת Nginx מוכנה  
✅ אבטחה מלאה  
✅ מדריכים מפורטים  
✅ כלי בדיקה  

**זמן פריסה משוער:** 30-60 דקות (כולל הגדרת השרת מאפס)

**עלות חודשית משוערת:** $12-24 (Droplet) + $0 (MongoDB/Firebase free tier)

---

**בהצלחה! 🚀**

