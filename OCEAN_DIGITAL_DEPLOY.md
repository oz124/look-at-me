# 🌊 מדריך פריסה ל-Ocean Digital

## 📋 דרישות מקדימות

לפני שמתחילים:
- [ ] חשבון Ocean Digital פעיל
- [ ] Droplet מוכן (Ubuntu 20.04/22.04 מומלץ)
- [ ] Domain מחובר (אם יש)
- [ ] MongoDB Atlas פעיל עם connection string
- [ ] Firebase project מוגדר
- [ ] OpenAI API key

---

## 🚀 שלבי ההתקנה

### שלב 1: הכנת השרת

התחבר לשרת שלך ב-Ocean Digital:

```bash
ssh root@YOUR_SERVER_IP
```

עדכן את המערכת:

```bash
apt update && apt upgrade -y
```

התקן Node.js 20 (LTS):

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs
node --version  # צריך להיות v20.x
npm --version
```

התקן PM2 (Process Manager):

```bash
npm install -g pm2
```

התקן Nginx:

```bash
apt install -y nginx
```

התקן Certbot (לSSL):

```bash
apt install -y certbot python3-certbot-nginx
```

---

### שלב 2: העלאת הקבצים

צור תיקיה לפרויקט:

```bash
mkdir -p /var/www/lookatme
cd /var/www/lookatme
```

**אופציה 1: העלאה ידנית**

במחשב המקומי שלך (Windows):

```powershell
# דחיסת הפרויקט
# בתיקיית הפרויקט, הרץ:
tar -czf lookatme.tar.gz dist api models src/lib server.js package.json package-lock.json ecosystem.config.js
```

העלה לשרת:

```bash
scp lookatme.tar.gz root@YOUR_SERVER_IP:/var/www/lookatme/
```

בשרת:

```bash
cd /var/www/lookatme
tar -xzf lookatme.tar.gz
rm lookatme.tar.gz
```

**אופציה 2: דרך Git (מומלץ)**

בשרת:

```bash
cd /var/www/lookatme
git clone https://github.com/YOUR_USERNAME/look-at-me.git .
```

---

### שלב 3: הגדרת Environment Variables

צור קובץ `.env.local`:

```bash
cd /var/www/lookatme
nano .env.local
```

העתק את התוכן מ-`PRODUCTION_ENV_TEMPLATE.txt` ומלא את כל הערכים:

```bash
NODE_ENV=production
PORT=3002

# Security Keys - צור מפתחות חזקים!
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)

# OpenAI
OPENAI_API_KEY=sk-proj-YOUR-KEY-HERE

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lookatme

# Firebase
VITE_FIREBASE_API_KEY=YOUR-KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXX

# CORS - הדומיין שלך!
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Facebook (אופציונלי)
VITE_FACEBOOK_APP_ID=your-app-id
FACEBOOK_APP_SECRET=your-secret

# Google (אופציונלי)
VITE_GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret

# TikTok (אופציונלי)
VITE_TIKTOK_CLIENT_KEY=your-key
TIKTOK_CLIENT_SECRET=your-secret
```

שמור (Ctrl+O, Enter, Ctrl+X) והגדר הרשאות:

```bash
chmod 600 .env.local
```

---

### שלב 4: התקנת Dependencies

```bash
cd /var/www/lookatme
npm install --production
```

---

### שלב 5: בדיקת השרת

התחל את השרת באופן זמני:

```bash
node server.js
```

בחלון נפרד, בדוק:

```bash
curl http://localhost:3002/api/health
```

אם מקבל `{"status":"OK"}` - מצוין! עצור את השרת (Ctrl+C).

---

### שלב 6: הפעלה עם PM2

הפעל את השרת עם PM2:

```bash
pm2 start ecosystem.config.js --env production
```

או באופן פשוט:

```bash
pm2 start server.js --name lookatme-backend --env production
```

בדוק סטטוס:

```bash
pm2 status
pm2 logs lookatme-backend
```

שמור את תצורת PM2:

```bash
pm2 save
pm2 startup
# הרץ את הפקודה שPM2 מציג
```

---

### שלב 7: הגדרת Nginx

צור קובץ תצורה ל-Nginx:

```bash
nano /etc/nginx/sites-available/lookatme
```

העתק את התוכן הבא (החלף `yourdomain.com` בדומיין שלך):

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL will be configured by Certbot
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend (React)
    location / {
        root /var/www/lookatme/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static files
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # File upload size
    client_max_body_size 100M;
    client_body_timeout 60s;
}
```

הפעל את התצורה:

```bash
ln -s /etc/nginx/sites-available/lookatme /etc/nginx/sites-enabled/
nginx -t  # בדיקת תקינות
systemctl reload nginx
```

---

### שלב 8: הגדרת SSL (HTTPS)

אם יש לך דומיין:

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

עקוב אחרי ההוראות של Certbot.

חידוש אוטומטי:

```bash
certbot renew --dry-run
```

---

### שלב 9: הגדרת Firewall

```bash
# הפעל UFW
ufw enable

# אפשר חיבורים נחוצים
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS

# בדוק סטטוס
ufw status
```

---

### שלב 10: בדיקה סופית

בדוק את האתר שלך בדפדפן:

```
https://yourdomain.com
```

בדוק את ה-API:

```bash
curl https://yourdomain.com/api/health
```

בדוק רישום (Login):
1. פתח את האתר
2. נסה להירשם ולהתחבר
3. העלה סרטון
4. בדוק שה-AI analysis עובד

---

## 🔧 פקודות שימושיות

### ניהול PM2

```bash
pm2 status              # סטטוס כל התהליכים
pm2 logs                # לוגים של כל התהליכים
pm2 logs lookatme       # לוגים של הפרויקט
pm2 restart all         # אתחול כל התהליכים
pm2 restart lookatme    # אתחול הפרויקט
pm2 stop all            # עצירת כל התהליכים
pm2 delete all          # מחיקת כל התהליכים
```

### ניהול Nginx

```bash
systemctl status nginx   # סטטוס
systemctl restart nginx  # אתחול
systemctl reload nginx   # טעינה מחדש
nginx -t                 # בדיקת תצורה
tail -f /var/log/nginx/access.log  # לוגים
tail -f /var/log/nginx/error.log   # שגיאות
```

### בדיקת Logs

```bash
# PM2 logs
pm2 logs lookatme --lines 100

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx -f
```

---

## 🔄 עדכון הפרויקט

כשיש שינויים בקוד:

```bash
cd /var/www/lookatme

# אם דרך Git:
git pull origin main

# התקן dependencies חדשים (אם יש)
npm install --production

# אתחל PM2
pm2 restart lookatme

# אתחל Nginx (אם יש שינויים בתצורה)
systemctl reload nginx
```

---

## 🐛 פתרון בעיות נפוצות

### שגיאת CORS

**תסמין:** `Access to fetch... has been blocked by CORS`

**פתרון:**
1. וודא ש-`ALLOWED_ORIGINS` ב-`.env.local` כולל את הדומיין שלך
2. פורמט נכון: `https://domain.com,https://www.domain.com` (ללא רווחים!)
3. אתחל PM2: `pm2 restart lookatme`

### שגיאת MongoDB

**תסמין:** `MongoServerError: bad auth`

**פתרון:**
1. MongoDB Atlas > Network Access > הוסף את IP השרת
2. בדוק username/password ב-connection string
3. בדוק שה-database name נכון

### שגיאת Firebase

**תסמין:** `Firebase: Error (auth/unauthorized-domain)`

**פתרון:**
1. Firebase Console > Authentication > Settings > Authorized domains
2. הוסף את הדומיין שלך
3. חכה 5-10 דקות לעדכון

### השרת לא עולה

**פתרון:**

```bash
# בדוק logs
pm2 logs lookatme --lines 50

# בדוק שהפורט פנוי
netstat -tulpn | grep 3002

# בדוק את .env.local
cat .env.local | grep OPENAI

# בדוק הרשאות
ls -la .env.local  # צריך להיות -rw------- (600)
```

### Nginx 502 Bad Gateway

**פתרון:**

```bash
# בדוק שהשרת רץ
pm2 status

# אם לא - הפעל:
pm2 start server.js --name lookatme

# בדוק שהפורט 3002 פתוח
curl http://localhost:3002/api/health

# אם עדיין לא עובד - בדוק לוגים
tail -f /var/log/nginx/error.log
```

---

## 🔐 אבטחה חשובה!

- [ ] `.env.local` עם הרשאות 600
- [ ] Firewall (UFW) מופעל
- [ ] SSL (HTTPS) פעיל
- [ ] MongoDB IP whitelist מוגדר
- [ ] Firebase Authorized Domains מוגדר
- [ ] Secrets חזקים (32+ תווים)
- [ ] `NODE_ENV=production`

---

## 📊 ניטור

התקן monitoring tools:

```bash
# RAM & CPU usage
htop

# Disk usage
df -h

# Process monitoring
pm2 monit

# Nginx status
systemctl status nginx
```

---

## 💰 אופטימיזציה לעלויות

ב-Ocean Digital, אפשר להקטין עלויות:

1. **Droplet Size:** התחל עם $12/חודש (2GB RAM)
2. **Backups:** הפעל automated backups ($2.4/חודש)
3. **Monitoring:** השתמש ב-PM2 (בחינם) במקום כלים אחרים
4. **CDN:** אם יש תנועה גבוהה, שקול Cloudflare (בחינם)

---

## ✅ Checklist פריסה סופי

לפני שמפרסמים:

- [ ] ה-build עבר בהצלחה
- [ ] `.env.local` מלא ותקין
- [ ] PM2 רץ ללא שגיאות
- [ ] Nginx מוגדר נכון
- [ ] SSL פעיל (HTTPS)
- [ ] Firewall מוגדר
- [ ] MongoDB מחובר
- [ ] Firebase מוגדר
- [ ] CORS עובד
- [ ] Login עובד
- [ ] Upload עובד
- [ ] AI Analysis עובד
- [ ] Campaign Creation עובד

---

## 🎉 סיימת!

האפליקציה שלך פועלת ב-Ocean Digital!

**לינקים שימושיים:**
- Ocean Digital Dashboard: https://cloud.digitalocean.com/
- MongoDB Atlas: https://cloud.mongodb.com/
- Firebase Console: https://console.firebase.google.com/
- OpenAI Dashboard: https://platform.openai.com/

**תמיכה:**
צור איתי קשר אם יש בעיות!

