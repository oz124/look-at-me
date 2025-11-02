#!/usr/bin/env node

/**
 * יצירת חבילת פריסה
 * Creates a deployment package ready for Ocean Digital
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 יוצר חבילת פריסה ל-Ocean Digital...\n');

// בדיקת dist
if (!fs.existsSync('dist')) {
  console.log('❌ dist/ לא נמצאת');
  console.log('🔨 בונה את הפרויקט...');
  try {
    execSync('npm run build:prod', { stdio: 'inherit' });
    console.log('✅ Build הושלם\n');
  } catch (error) {
    console.log('❌ Build נכשל');
    process.exit(1);
  }
}

// שם הארכיון
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
const archiveName = `lookatme-deploy-${timestamp}.tar.gz`;

// רשימת קבצים לכלול
const filesToInclude = [
  'dist',
  'api',
  'models',
  'src/lib',
  'server.js',
  'package.json',
  'package-lock.json',
  'ecosystem.config.js',
];

// בדיקה שכל הקבצים קיימים
console.log('🔍 בודק קבצים...');
let allExist = true;
filesToInclude.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} לא נמצא`);
    allExist = false;
  }
});

if (!allExist) {
  console.log('\n❌ חסרים קבצים נדרשים');
  process.exit(1);
}

// יצירת הארכיון
console.log(`\n📦 יוצר ארכיון: ${archiveName}...`);
try {
  const command = `tar -czf ${archiveName} ${filesToInclude.join(' ')}`;
  execSync(command, { stdio: 'inherit' });
  
  // בדיקת גודל
  const stats = fs.statSync(archiveName);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log('\n✅ ארכיון נוצר בהצלחה!');
  console.log(`📊 גודל: ${sizeMB} MB`);
  console.log(`📁 מיקום: ${path.resolve(archiveName)}`);
  
  console.log('\n📤 להעלאה לשרת:');
  console.log(`   scp ${archiveName} root@YOUR_SERVER_IP:/tmp/`);
  console.log('');
  console.log('🚀 פריסה בשרת:');
  console.log('   ssh root@YOUR_SERVER_IP');
  console.log('   cd /var/www/lookatme');
  console.log(`   tar -xzf /tmp/${archiveName}`);
  console.log('   npm install --production');
  console.log('   pm2 restart lookatme');
  console.log('');
  
} catch (error) {
  console.log('❌ שגיאה ביצירת הארכיון');
  console.log(error.message);
  process.exit(1);
}

