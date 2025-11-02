#!/bin/bash

# 🌊 Ocean Digital Deployment Script
# מסריפט אוטומטי לפריסה ב-Ocean Digital

set -e  # Exit on error

# צבעים לoutput
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌊 Ocean Digital Deployment Script${NC}"
echo "=================================="
echo ""

# בדיקת ארגומנטים
if [ -z "$1" ]; then
    echo -e "${RED}❌ שגיאה: חסר כתובת IP של השרת${NC}"
    echo ""
    echo "שימוש:"
    echo "  ./deploy-to-ocean.sh USER@SERVER_IP"
    echo ""
    echo "דוגמה:"
    echo "  ./deploy-to-ocean.sh root@123.456.789.0"
    echo ""
    exit 1
fi

SERVER=$1
REMOTE_PATH="/var/www/lookatme"

echo -e "${YELLOW}📋 הגדרות פריסה:${NC}"
echo "  שרת: $SERVER"
echo "  נתיב: $REMOTE_PATH"
echo ""

# בדיקת חיבור לשרת
echo -e "${BLUE}🔍 בודק חיבור לשרת...${NC}"
if ! ssh -o ConnectTimeout=5 -o BatchMode=yes "$SERVER" exit 2>/dev/null; then
    echo -e "${RED}❌ לא ניתן להתחבר לשרת${NC}"
    echo "וודא ש-SSH keys מוגדרים או השתמש בסיסמה"
    exit 1
fi
echo -e "${GREEN}✅ החיבור לשרת תקין${NC}"
echo ""

# בניית הפרויקט
echo -e "${BLUE}🏗️  בונה את הפרויקט...${NC}"
npm run build:prod
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build הושלם בהצלחה${NC}"
else
    echo -e "${RED}❌ Build נכשל${NC}"
    exit 1
fi
echo ""

# יצירת ארכיון
echo -e "${BLUE}📦 יוצר ארכיון...${NC}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE_NAME="lookatme_${TIMESTAMP}.tar.gz"

tar -czf "$ARCHIVE_NAME" \
    dist/ \
    api/ \
    models/ \
    src/lib/ \
    server.js \
    package.json \
    package-lock.json \
    ecosystem.config.js \
    2>/dev/null || true

echo -e "${GREEN}✅ ארכיון נוצר: $ARCHIVE_NAME${NC}"
echo ""

# העלאת הארכיון לשרת
echo -e "${BLUE}📤 מעלה לשרת...${NC}"
scp "$ARCHIVE_NAME" "$SERVER:/tmp/"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ הארכיון הועלה בהצלחה${NC}"
else
    echo -e "${RED}❌ העלאה נכשלה${NC}"
    rm "$ARCHIVE_NAME"
    exit 1
fi
echo ""

# פריסה בשרת
echo -e "${BLUE}🚀 מפרוס בשרת...${NC}"
ssh "$SERVER" << 'ENDSSH'
set -e

REMOTE_PATH="/var/www/lookatme"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# צור תיקייה אם לא קיימת
echo "📁 יוצר תיקיית פרויקט..."
mkdir -p "$REMOTE_PATH"
cd "$REMOTE_PATH"

# גיבוי של הגרסה הקודמת (אם קיימת)
if [ -d "dist" ]; then
    echo "💾 מגבה גרסה קודמת..."
    mkdir -p backups
    tar -czf "backups/backup_${TIMESTAMP}.tar.gz" dist/ api/ models/ server.js 2>/dev/null || true
    echo "✅ גיבוי נוצר: backups/backup_${TIMESTAMP}.tar.gz"
fi

# חלץ את הארכיון החדש
echo "📦 מחלץ קבצים חדשים..."
ARCHIVE_NAME=$(ls -t /tmp/lookatme_*.tar.gz | head -1)
tar -xzf "$ARCHIVE_NAME" -C "$REMOTE_PATH"
rm "$ARCHIVE_NAME"

# התקן dependencies (אם יש package.json חדש)
echo "📦 מתקין dependencies..."
npm install --production --no-audit --no-fund

# אתחל PM2
echo "🔄 מאתחל PM2..."
if pm2 list | grep -q "lookatme"; then
    pm2 restart lookatme
    echo "✅ PM2 אותחל"
else
    pm2 start server.js --name lookatme --env production
    pm2 save
    echo "✅ PM2 הופעל לראשונה"
fi

echo ""
echo "✅ פריסה הושלמה בהצלחה!"
ENDSSH

echo ""
echo -e "${GREEN}🎉 הפריסה הושלמה בהצלחה!${NC}"
echo ""

# ניקוי מקומי
rm "$ARCHIVE_NAME"
echo -e "${BLUE}🧹 ניקוי קבצים זמניים...${NC}"
echo ""

# בדיקת בריאות השרת
echo -e "${BLUE}🏥 בודק את בריאות השרת...${NC}"
sleep 3

SERVER_IP=$(echo "$SERVER" | cut -d@ -f2)
if curl -s -o /dev/null -w "%{http_code}" "http://$SERVER_IP:3002/api/health" | grep -q "200"; then
    echo -e "${GREEN}✅ השרת פעיל ותקין!${NC}"
else
    echo -e "${YELLOW}⚠️  השרת אולי לא פעיל עדיין, בדוק logs:${NC}"
    echo "  ssh $SERVER 'pm2 logs lookatme'"
fi
echo ""

echo -e "${GREEN}=================================="
echo "🎉 פריסה הושלמה בהצלחה!"
echo "==================================${NC}"
echo ""
echo "פקודות שימושיות:"
echo "  ssh $SERVER 'pm2 status'              # סטטוס PM2"
echo "  ssh $SERVER 'pm2 logs lookatme'       # לוגים"
echo "  ssh $SERVER 'pm2 restart lookatme'    # אתחול"
echo ""

