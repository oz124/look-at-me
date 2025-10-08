# 🎯 Look At Me - AI-Powered Marketing Platform

> פלטפורמה מתקדמת ליצירת קמפיינים שיווקיים חכמים עם ניתוח AI של וידאו ופריסה אוטומטית לפלטפורמות מדיה חברתית

[![Security](https://img.shields.io/badge/security-A+-green)]()
[![Node.js](https://img.shields.io/badge/node.js-v18+-blue)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.3-blue)](https://reactjs.org/)

---

## ✨ תכונות

- 🎥 **ניתוח AI מתקדם** - OpenAI לניתוח וידאו וזיהוי תוכן
- 🎯 **המלצות אוטומטיות** - אסטרטגיות שיווק מותאמות
- 📱 **פריסה multi-platform** - Facebook, Instagram, Google, YouTube, TikTok
- 💰 **אופטימיזציה חכמה** - חלוקת תקציב אוטומטית
- ✏️ **עריכה ידנית** - שליטה מלאה על כל המלצה
- 📊 **ביצועים בזמן אמת** - Analytics live מכל הפלטפורמות
- 🔒 **אבטחה מתקדמת** - Helmet, CSRF, Rate Limiting
- 🌐 **RTL Support** - עברית ואנגלית מלאים

---

## 🚀 התקנה

```bash
# Install
npm install

# Configure
cp env.local.example .env.local
# Edit .env.local with your API keys

# Run
npm run dev
```

- Frontend: http://localhost:8080
- Backend: http://localhost:3002

---

## ⚙️ Environment Variables

ערוך `.env.local`:

```bash
# OpenAI (Required)
OPENAI_API_KEY=sk-proj-your-key

# Facebook & Instagram
VITE_FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_secret

# Google
VITE_GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret

# Security (generate random)
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)
```

---

## 📁 מבנה

```
look-at-me-main/
├── api/              # Backend endpoints
│   ├── ai/          # AI analysis
│   ├── analytics/   # Metrics & reporting
│   ├── campaigns/   # Campaign management
│   └── platforms/   # OAuth & integrations
├── src/             # Frontend React
│   ├── pages/       # Campaign, Analytics, Auth
│   ├── components/  # UI components
│   ├── hooks/       # Custom hooks
│   └── lib/         # Utils & services
├── server-enhanced.js  # Production server
└── package.json
```

---

## 🔧 Scripts

```bash
# Development
npm run dev                # Frontend + Backend
npm run dev:frontend       # Vite only
npm run dev:backend        # Node only

# Production
npm run build:prod         # Build optimized
npm run start:prod         # Start production

# Security
npm run pre-deploy         # Pre-deployment check
npm audit                  # Check vulnerabilities
```

---

## 🛡️ אבטחה

- ✅ כל API keys בצד server
- ✅ Helmet.js + CSP
- ✅ CORS Protection
- ✅ Rate Limiting
- ✅ CSRF Protection
- ✅ Input Validation
- ✅ File Encryption
- ✅ OAuth2 Flow

---

## 📦 Deployment

```bash
# 1. Pre-flight check
npm run pre-deploy

# 2. Build
npm run build:prod

# 3. Start with PM2
pm2 start ecosystem.config.js

# 4. Monitor
pm2 logs
pm2 monit
```

---

## 🏗️ Tech Stack

**Frontend:** React 18, TypeScript, Tailwind, shadcn/ui  
**Backend:** Node.js, Express 5, Helmet, JWT  
**AI:** OpenAI GPT-4o, Whisper  
**Analytics:** Facebook Graph, Google Ads, TikTok Marketing API

---

## 📝 License

Private - All Rights Reserved

---

**Built with AI 🤖 | October 2025**
