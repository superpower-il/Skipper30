# ⛵ משיט 30 — Notebook

כלי לימוד מלא לקורס סקיפרים — משיט 30.
כולל 4 נושאי מבחן: ימאות, מכונאות, ניווט חופי וניווט מכשירים.

## פיצ׳רים
- 📝 מבחני תרגול עם מעקב ציונים
- 🃏 כרטיסיות לימוד (Flashcards)
- 📖 סיכומי נושאים
- 💬 צ׳אט AI (מבוסס Claude) לשאלות על החומר

## התקנה מקומית

```bash
npm install
npm run dev
```

## Deploy ל-Vercel

### 1. העלאה
```bash
# Option A: Vercel CLI
npm i -g vercel
vercel

# Option B: חבר GitHub repo ל-Vercel Dashboard
```

### 2. הגדרת Environment Variable
בממשק של Vercel, הוסף:

```
ANTHROPIC_API_KEY=sk-ant-...
```

זה נדרש רק לפיצ׳ר הצ׳אט AI. כל שאר הפיצ׳רים עובדים בלי מפתח.

### 3. Build Settings (אוטומטי בדרך כלל)
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

## מבנה הפרויקט
```
skipper30-notebook/
├── api/
│   └── chat.js          # Vercel serverless function for AI chat
├── src/
│   ├── App.jsx          # Main React app
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
└── vite.config.js
```
