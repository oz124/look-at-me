#!/usr/bin/env node

/**
 * Pre-Deployment Security Check Script
 * Runs comprehensive security checks before deploying to production
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔒 Running Pre-Deployment Security Checks...\n');

let totalIssues = 0;
let criticalIssues = 0;
let warnings = 0;

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
  criticalIssues++;
  totalIssues++;
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
  warnings++;
  totalIssues++;
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

// Check 1: Environment Variables
console.log('\n📋 Check 1: Environment Variables\n');
function checkEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  
  if (!fs.existsSync(envPath)) {
    logError('.env.local file not found!');
    logInfo('Create .env.local from env.local.example');
    return false;
  }
  
  logSuccess('.env.local file exists');
  
  // Load environment variables manually
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  // Remove BOM if present
  const cleanContent = envContent.replace(/^\uFEFF/, '');
  
  cleanContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        envVars[key] = valueParts.join('=');
      }
    }
  });
  
  
  const requiredVars = [
    'OPENAI_API_KEY'
  ];
  
  const optionalVars = [
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'SESSION_SECRET',
    'ALLOWED_ORIGINS',
    'GOOGLE_ADS_DEVELOPER_TOKEN',
    'VITE_TIKTOK_CLIENT_KEY',
    'TIKTOK_CLIENT_SECRET'
  ];
  
  const missingVars = [];
  const weakVars = [];
  
  requiredVars.forEach(varName => {
    const value = envVars[varName];
    
    if (!value) {
      missingVars.push(varName);
    } else {
      if (value.includes('your-') || value.includes('test-') || value.includes('YOUR_') || value.length < 20) {
        weakVars.push(varName);
      }
    }
  });
  
  // Check optional variables
  const missingOptionalVars = [];
  optionalVars.forEach(varName => {
    const value = envVars[varName];
    if (!value || value.includes('YOUR_') || value.includes('your-')) {
      missingOptionalVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    logError(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  } else {
    logSuccess('All required environment variables are present');
  }
  
  if (weakVars.length > 0) {
    logWarning(`Weak or placeholder values in: ${weakVars.join(', ')}`);
    logInfo('Generate strong random values for production');
  } else {
    logSuccess('All required environment variables have strong values');
  }
  
  if (missingOptionalVars.length > 0) {
    logWarning(`Optional variables need configuration: ${missingOptionalVars.join(', ')}`);
    logInfo('These are needed for full functionality but not critical for basic deployment');
  }
  
  return true;
}

checkEnvFile();

// Check 2: Dependencies Security
console.log('\n📦 Check 2: Dependencies Security\n');
function checkDependencies() {
  try {
    logInfo('Running npm audit...');
    const output = execSync('npm audit --production --json', { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    const audit = JSON.parse(output);
    const vulnCount = audit.metadata?.vulnerabilities || {};
    const total = Object.values(vulnCount).reduce((a, b) => a + b, 0);
    
    if (total === 0) {
      logSuccess('No vulnerabilities found in production dependencies');
    } else {
      const critical = vulnCount.critical || 0;
      const high = vulnCount.high || 0;
      const moderate = vulnCount.moderate || 0;
      
      if (critical > 0) {
        logError(`${critical} critical vulnerabilities found!`);
      }
      if (high > 0) {
        logError(`${high} high vulnerabilities found!`);
      }
      if (moderate > 0) {
        logWarning(`${moderate} moderate vulnerabilities found`);
      }
      
      logInfo('Run: npm audit fix');
    }
  } catch (error) {
    if (error.stdout) {
      try {
        const audit = JSON.parse(error.stdout);
        const vulnCount = audit.metadata?.vulnerabilities || {};
        const total = Object.values(vulnCount).reduce((a, b) => a + b, 0);
        
        if (total > 0) {
          logError(`${total} vulnerabilities found in dependencies`);
          logInfo('Run: npm audit fix');
        }
      } catch (e) {
        logWarning('Could not parse npm audit output');
      }
    }
  }
}

checkDependencies();

// Check 3: Sensitive Data in Code
console.log('\n🔍 Check 3: Sensitive Data in Code\n');
function checkForSecrets() {
  const patterns = [
    { pattern: /sk-[a-zA-Z0-9]{48}/, name: 'OpenAI API Key' },
    { pattern: /\b[A-Za-z0-9]{32,}\b/, name: 'Potential API Key' },
    { pattern: /password\s*=\s*["'][^"']+["']/i, name: 'Hardcoded Password' },
    { pattern: /secret\s*=\s*["'][^"']+["']/i, name: 'Hardcoded Secret' }
  ];
  
  const srcFiles = getAllFiles('./src', ['.ts', '.tsx', '.js', '.jsx']);
  let foundSecrets = 0;
  
  srcFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    patterns.forEach(({ pattern, name }) => {
      if (pattern.test(content) && !content.includes('example') && !content.includes('test-')) {
        logWarning(`Potential ${name} found in ${file}`);
        foundSecrets++;
      }
    });
  });
  
  if (foundSecrets === 0) {
    logSuccess('No hardcoded secrets found in source code');
  } else {
    logWarning(`Found ${foundSecrets} potential secrets in code`);
  }
}

function getAllFiles(dir, extensions, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        getAllFiles(filePath, extensions, fileList);
      }
    } else if (extensions.some(ext => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

checkForSecrets();

// Check 4: Build Status
console.log('\n🏗️  Check 4: Production Build\n');
function checkBuild() {
  const distPath = path.join(__dirname, 'dist');
  
  if (!fs.existsSync(distPath)) {
    logError('Production build not found (dist/ directory missing)');
    logInfo('Run: npm run build:prod');
    return false;
  }
  
  logSuccess('Production build exists');
  
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    logError('index.html not found in dist/');
    return false;
  }
  
  logSuccess('Build files are present');
  return true;
}

checkBuild();

// Check 5: Git Status
console.log('\n📝 Check 5: Git Status\n');
function checkGit() {
  try {
    // Check .gitignore
    const gitignorePath = path.join(__dirname, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignore = fs.readFileSync(gitignorePath, 'utf8');
      const requiredEntries = ['.env', '.env.local', '*.key', '*.pem'];
      const missing = requiredEntries.filter(entry => !gitignore.includes(entry));
      
      if (missing.length > 0) {
        logWarning(`.gitignore missing entries: ${missing.join(', ')}`);
      } else {
        logSuccess('.gitignore properly configured');
      }
    }
    
    // Check for uncommitted changes
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        logWarning('You have uncommitted changes');
        logInfo('Commit or stash changes before deploying');
      } else {
        logSuccess('No uncommitted changes');
      }
    } catch (e) {
      logInfo('Not a git repository or git not available');
    }
  } catch (error) {
    logWarning('Could not check git status');
  }
}

checkGit();

// Check 6: Security Headers Check
console.log('\n🛡️  Check 6: Security Configuration\n');
function checkSecurityConfig() {
  const serverPath = path.join(__dirname, 'server-enhanced.js');
  
  if (!fs.existsSync(serverPath)) {
    logWarning('server-enhanced.js not found');
    return;
  }
  
  const content = fs.readFileSync(serverPath, 'utf8');
  const securityFeatures = [
    { pattern: /helmet\(/, name: 'Helmet.js' },
    { pattern: /Strict-Transport-Security/, name: 'HSTS' },
    { pattern: /X-Frame-Options/, name: 'Frame Options' },
    { pattern: /contentSecurityPolicy/, name: 'CSP' },
    { pattern: /rateLimit/, name: 'Rate Limiting' }
  ];
  
  securityFeatures.forEach(({ pattern, name }) => {
    if (pattern.test(content)) {
      logSuccess(`${name} is configured`);
    } else {
      logWarning(`${name} not found in server configuration`);
    }
  });
}

checkSecurityConfig();

// Final Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Security Check Summary');
console.log('='.repeat(50) + '\n');

if (criticalIssues > 0) {
  console.log(`${colors.red}❌ ${criticalIssues} Critical Issue(s)${colors.reset}`);
}

if (warnings > 0) {
  console.log(`${colors.yellow}⚠️  ${warnings} Warning(s)${colors.reset}`);
}

if (totalIssues === 0) {
  console.log(`${colors.green}✅ All checks passed! Ready for deployment!${colors.reset}\n`);
  process.exit(0);
} else if (criticalIssues > 0) {
  console.log(`\n${colors.red}❌ Critical issues found. Please fix them before deploying.${colors.reset}\n`);
  process.exit(1);
} else {
  console.log(`\n${colors.yellow}⚠️  Warnings found. Review them before deploying.${colors.reset}\n`);
  process.exit(0);
}
