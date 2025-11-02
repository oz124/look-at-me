#!/usr/bin/env node

/**
 * בדיקה מהירה לפני פריסה
 * Quick Pre-Deployment Check
 */

const fs = require('fs');
const path = require('path');

console.log('⚡ בדיקה מהירה לפני פריסה...\n');

let issues = 0;

// 1. בדיקת dist/
console.log('📁 בודק תיקיית build...');
if (fs.existsSync('dist')) {
  console.log('✅ dist/ קיימת');
  if (fs.existsSync('dist/index.html')) {
    console.log('✅ dist/index.html קיים');
  } else {
    console.log('❌ dist/index.html לא נמצא!');
    issues++;
  }
} else {
  console.log('❌ dist/ לא נמצאת - הרץ: npm run build:prod');
  issues++;
}

// 2. בדיקת קבצים נדרשים
console.log('\n📄 בודק קבצים נדרשים...');
const requiredFiles = [
  'server.js',
  'package.json',
  'ecosystem.config.js',
  'api/ai/analyze.js',
  'models/Campaign.js',
  'models/User.js',
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} לא נמצא!`);
    issues++;
  }
});

// 3. בדיקת .env.local
console.log('\n🔐 בודק environment variables...');
if (fs.existsSync('.env.local')) {
  console.log('⚠️  .env.local נמצא מקומית');
  console.log('   וודא שיש .env.local בשרת!');
} else {
  console.log('ℹ️  .env.local לא נמצא (זה בסדר, צריך להיות רק בשרת)');
}

// 4. בדיקת .gitignore
console.log('\n🔒 בודק .gitignore...');
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  const shouldIgnore = ['.env', '.env.local'];
  shouldIgnore.forEach(pattern => {
    if (gitignore.includes(pattern)) {
      console.log(`✅ ${pattern} ב-.gitignore`);
    } else {
      console.log(`⚠️  ${pattern} לא ב-.gitignore`);
      issues++;
    }
  });
}

// 5. בדיקת node_modules
console.log('\n📦 בודק dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules קיים');
} else {
  console.log('⚠️  node_modules לא קיים - הרץ: npm install');
  issues++;
}

// 6. בדיקת package.json
console.log('\n📋 בודק package.json...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['build', 'build:prod', 'start'];
  requiredScripts.forEach(script => {
    if (pkg.scripts && pkg.scripts[script]) {
      console.log(`✅ סקריפט ${script} קיים`);
    } else {
      console.log(`❌ סקריפט ${script} חסר!`);
      issues++;
    }
  });
} catch (error) {
  console.log('❌ שגיאה בקריאת package.json');
  issues++;
}

// 7. בדיקת גודל dist
console.log('\n📊 בודק גודל build...');
if (fs.existsSync('dist')) {
  const { execSync } = require('child_process');
  try {
    let size;
    if (process.platform === 'win32') {
      // Windows - approximate size
      const files = fs.readdirSync('dist', { recursive: true });
      console.log(`   קבצים: ${files.length}`);
    } else {
      // Unix-like systems
      size = execSync('du -sh dist', { encoding: 'utf8' }).trim();
      console.log(`   גודל: ${size}`);
    }
  } catch (e) {
    console.log('   (לא ניתן לחשב גודל)');
  }
}

// סיכום
console.log('\n' + '='.repeat(50));
if (issues === 0) {
  console.log('✅ הכל תקין! מוכן לפריסה!');
  console.log('\nפקודות פריסה:');
  console.log('  Windows: .\\deploy-to-ocean.ps1 root@YOUR_SERVER_IP');
  console.log('  Linux:   ./deploy-to-ocean.sh root@YOUR_SERVER_IP');
  console.log('='.repeat(50));
  process.exit(0);
} else {
  console.log(`⚠️  נמצאו ${issues} בעיות - תקן אותן לפני פריסה`);
  console.log('='.repeat(50));
  process.exit(1);
}

