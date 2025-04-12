# 🎤 PresentationPro - AI-Based Presentation Feedback Web App

**PresentationPro** is an AI-powered web application that helps users improve public speaking by analyzing uploaded presentation videos. It provides visual feedback on various presentation skills like confidence, eye contact, body language, and facial expressions.

---

## 📌 Features

- 📹 Upload your presentation videos
- ⚙️ AI-based evaluation (mocked/real)
- 📊 Progress bars for:
  - Confidence
  - Eye Contact
  - Body Language
  - Facial Expressions
- 🎨 Color-coded scores:
  - ✅ Green (80%+)
  - 🟡 Yellow (65–79%)
  - 🔴 Red (<65%)
- ⌛ Real-time analysis status: Processing, Completed, Failed
- 📚 Learning Center & Help Links
- 🎨 Responsive UI built with Tailwind CSS

---

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express, TypeScript
- **Icons:** Remix Icons
- **Other Tools:** tsx, Vite for bundling and fast refresh

---

## 📁 Folder Structure

```
PresentationPro/
│
├── client/                  # Frontend source
│   ├── components/          # UI components
│   ├── pages/               # Routes like Home/Upload
│   └── App.tsx              # Router entry
│
├── server/                  # Express backend
│   └── index.ts             # API routes & upload handling
│
├── shared/                 # Shared types/schemas
│   └── schema.ts
│
├── public/                 # Static assets
├── package.json            # Scripts and dependencies
└── vite.config.ts          # Vite config
```

---

## 🚀 Installation & Run (VS Code)

### ✅ Requirements
- Node.js (v16+)
- npm or yarn
- VS Code

### 📦 Install & Run
```bash
# Step 1: Clone the project
git clone https://github.com/yourusername/presentationpro.git
cd presentationpro

# Step 2: Install dependencies
npm install

# Step 3: Start the dev server
npm run dev
```

Open browser at `http://localhost:5000`

---

## 💡 How to Use

1. Start the server with `npm run dev`
2. Go to `http://localhost:5000`
3. Upload a video of your presentation
4. Wait for analysis to complete
5. View performance scores with color-coded bars

---

## 🧩 Troubleshooting

| Issue | Solution |
|-------|----------|
| 🔄 External link error | Use `window.open('https://freecodecamp.org/learn')` instead of `<Link>` for external sites |
| 🚫 No progress bar | Ensure scores are numbers. Use `score ?? 0` for fallback |
| 🟡 Only yellow bar showing | Check the `getProgressColor()` logic — make sure all scores pass correct thresholds |
| 🖼 Remix icons not showing | Verify remixicon is installed or CDN included |

---

## 🔮 Future Features (Optional)

- Speech tone, pace, and volume analysis
- Report download (PDF)
- User login & dashboard
- Real-time presentation feedback
- History tracking

---

## 🙌 Contributing

Want to help improve this project?

1. Fork the repo
2. Create a feature branch
3. Commit and push changes
4. Open a pull request

---

## 📝 License

MIT License

---

## 👋 Contact

- Developer: Diabolic Devs
- GitHub: [(https://github.com/Raghavyd/presentai)]
- Email: 
