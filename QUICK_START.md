# Quick Start Guide - Push to GitHub

## 🚀 Fastest Method (No Git Installation Required)

### GitHub Web Upload - 3 Minutes

1. **Open GitHub Repository**
   - Go to: https://github.com/prempradip/darkpatterns
   - If it doesn't exist, create it at: https://github.com/new

2. **Upload Files**
   - Click the "Add file" button (top right)
   - Select "Upload files"
   
3. **Drag and Drop**
   - Open your folder: `C:\Users\prem.pradeep\Downloads\Dark Patterns`
   - Select ALL these files:
     ```
     ✓ .gitignore
     ✓ export-report.js
     ✓ index.html
     ✓ pattern-detection-rules.js
     ✓ pattern-severity-index.js
     ✓ PUSH_TO_GITHUB.md
     ✓ QUICK_START.md
     ✓ README.md
     ✓ scoring-logic.js
     ✓ script.js
     ✓ styles.css
     ✓ push-to-github.bat
     ```
   - Drag them into the GitHub upload area

4. **Commit**
   - Add commit message: `Initial commit: Dark Pattern Detector with PES system`
   - Click "Commit changes"

5. **Done!** 🎉
   - View your live site at: `https://prempradip.github.io/darkpatterns`
   - (Enable GitHub Pages in Settings → Pages → Source: main branch)

---

## ⚡ With Git Installed (Automated)

### Option A: Double-click the batch file
1. Install Git: https://git-scm.com/download/win
2. Double-click `push-to-github.bat`
3. Follow the prompts
4. Done!

### Option B: Command Line
1. Install Git: https://git-scm.com/download/win
2. Open PowerShell in this folder
3. Run:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit: Dark Pattern Detector with PES system"
   git remote add origin https://github.com/prempradip/darkpatterns.git
   git branch -M main
   git push -u origin main
   ```

---

## 🌐 Enable GitHub Pages (Make it Live)

After pushing to GitHub:

1. Go to: https://github.com/prempradip/darkpatterns/settings/pages
2. Under "Source", select: `main` branch
3. Click "Save"
4. Wait 1-2 minutes
5. Your site will be live at: `https://prempradip.github.io/darkpatterns`

---

## 📱 Test Your Site

Once live, test on:
- Desktop browser
- Mobile phone
- Tablet

Try analyzing:
- Enter a URL: `https://example.com`
- Upload a screenshot

---

## ❓ Need Help?

**Can't upload to GitHub?**
- Make sure you're logged into GitHub
- Check if repository name is correct: `darkpatterns`
- Try creating a new repository first

**Git authentication issues?**
- Use Personal Access Token instead of password
- Generate at: https://github.com/settings/tokens
- Select "repo" permissions

**Files not showing?**
- Make sure you selected ALL files (including .gitignore)
- Don't upload the folders (.vscode, dark-patterns, darkpatterns)
- Only upload the 12 files listed above

---

## ✅ Verification Checklist

After pushing, verify:
- [ ] All 12 files are visible on GitHub
- [ ] README.md displays correctly
- [ ] index.html is present
- [ ] Can view raw files
- [ ] GitHub Pages is enabled (optional)
- [ ] Site loads correctly (if Pages enabled)

---

## 🎯 What's Next?

Your Dark Pattern Detector is now on GitHub! You can:

1. **Share it**: Send the GitHub link to others
2. **Deploy it**: Enable GitHub Pages for a live demo
3. **Improve it**: Add real pattern detection (AI/ML)
4. **Integrate**: Connect to a backend API
5. **Collaborate**: Invite others to contribute

Congratulations! 🎉
