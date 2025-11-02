# 🌊 Ocean Digital Deployment Script for Windows PowerShell
# סקריפט פריסה אוטומטי ל-Ocean Digital מ-Windows

param(
    [Parameter(Mandatory=$true)]
    [string]$Server,
    
    [Parameter(Mandatory=$false)]
    [string]$RemotePath = "/var/www/lookatme"
)

$ErrorActionPreference = "Stop"

Write-Host "🌊 Ocean Digital Deployment Script" -ForegroundColor Blue
Write-Host "==================================" -ForegroundColor Blue
Write-Host ""

Write-Host "📋 הגדרות פריסה:" -ForegroundColor Yellow
Write-Host "  שרת: $Server"
Write-Host "  נתיב: $RemotePath"
Write-Host ""

# בדיקת חיבור לשרת
Write-Host "🔍 בודק חיבור לשרת..." -ForegroundColor Blue
try {
    $testConnection = ssh -o ConnectTimeout=5 -o BatchMode=yes "$Server" "exit" 2>&1
    Write-Host "✅ החיבור לשרת תקין" -ForegroundColor Green
} catch {
    Write-Host "❌ לא ניתן להתחבר לשרת" -ForegroundColor Red
    Write-Host "וודא ש-SSH keys מוגדרים או השתמש בסיסמה" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# בניית הפרויקט
Write-Host "🏗️  בונה את הפרויקט..." -ForegroundColor Blue
npm run build:prod
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build הושלם בהצלחה" -ForegroundColor Green
} else {
    Write-Host "❌ Build נכשל" -ForegroundColor Red
    exit 1
}
Write-Host ""

# יצירת ארכיון
Write-Host "📦 יוצר ארכיון..." -ForegroundColor Blue
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$archiveName = "lookatme_$timestamp.tar.gz"

# יצירת ארכיון עם tar (אם יש WSL או Git Bash)
try {
    tar -czf $archiveName dist/ api/ models/ src/lib/ server.js package.json package-lock.json ecosystem.config.js 2>$null
    Write-Host "✅ ארכיון נוצר: $archiveName" -ForegroundColor Green
} catch {
    Write-Host "❌ יצירת ארכיון נכשלה" -ForegroundColor Red
    Write-Host "וודא ש-tar מותקן (Git Bash או WSL)" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# העלאת הארכיון לשרת
Write-Host "📤 מעלה לשרת..." -ForegroundColor Blue
try {
    scp $archiveName "${Server}:/tmp/"
    Write-Host "✅ הארכיון הועלה בהצלחה" -ForegroundColor Green
} catch {
    Write-Host "❌ העלאה נכשלה" -ForegroundColor Red
    Remove-Item $archiveName
    exit 1
}
Write-Host ""

# פריסה בשרת
Write-Host "🚀 מפרוס בשרת..." -ForegroundColor Blue

$deployScript = @'
set -e

REMOTE_PATH="/var/www/lookatme"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "📁 יוצר תיקיית פרויקט..."
mkdir -p "$REMOTE_PATH"
cd "$REMOTE_PATH"

if [ -d "dist" ]; then
    echo "💾 מגבה גרסה קודמת..."
    mkdir -p backups
    tar -czf "backups/backup_${TIMESTAMP}.tar.gz" dist/ api/ models/ server.js 2>/dev/null || true
    echo "✅ גיבוי נוצר"
fi

echo "📦 מחלץ קבצים חדשים..."
ARCHIVE_NAME=$(ls -t /tmp/lookatme_*.tar.gz | head -1)
tar -xzf "$ARCHIVE_NAME" -C "$REMOTE_PATH"
rm "$ARCHIVE_NAME"

echo "📦 מתקין dependencies..."
npm install --production --no-audit --no-fund

echo "🔄 מאתחל PM2..."
if pm2 list | grep -q "lookatme"; then
    pm2 restart lookatme
    echo "✅ PM2 אותחל"
else
    pm2 start server.js --name lookatme --env production
    pm2 save
    echo "✅ PM2 הופעל"
fi

echo ""
echo "✅ פריסה הושלמה בהצלחה!"
'@

ssh $Server $deployScript

Write-Host ""
Write-Host "🎉 הפריסה הושלמה בהצלחה!" -ForegroundColor Green
Write-Host ""

# ניקוי מקומי
Remove-Item $archiveName
Write-Host "🧹 ניקוי קבצים זמניים..." -ForegroundColor Blue
Write-Host ""

# בדיקת בריאות השרת
Write-Host "🏥 בודק את בריאות השרת..." -ForegroundColor Blue
Start-Sleep -Seconds 3

$serverIp = $Server -replace '.*@', ''
try {
    $response = Invoke-WebRequest -Uri "http://${serverIp}:3002/api/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ השרת פעיל ותקין!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  השרת אולי לא פעיל עדיין, בדוק logs:" -ForegroundColor Yellow
    Write-Host "  ssh $Server 'pm2 logs lookatme'" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "==================================" -ForegroundColor Green
Write-Host "🎉 פריסה הושלמה בהצלחה!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "פקודות שימושיות:"
Write-Host "  ssh $Server 'pm2 status'              # סטטוס PM2"
Write-Host "  ssh $Server 'pm2 logs lookatme'       # לוגים"
Write-Host "  ssh $Server 'pm2 restart lookatme'    # אתחול"
Write-Host ""

