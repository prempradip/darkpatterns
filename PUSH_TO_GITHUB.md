# How to Push to GitHub

Since Git is not installed on your system, here are your options:

## Option 1: Install Git and Push via Command Line (Recommended)

### Step 1: Install Git
Download and install Git from: https://git-scm.com/download/win

### Step 2: Configure Git (First time only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Initialize and Push
Open Command Prompt or PowerShell in your project folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Dark Pattern Detector with PES system"

# Add remote repository
git remote add origin https://github.com/prempradip/darkpatterns.git

# Push to GitHub
git branch -M main
git push -u origin main
```

If the repository already exists and you want to force push:
```bash
git push -f origin main
```

---

## Option 2: GitHub Desktop (Easiest)

### Step 1: Install GitHub Desktop
Download from: https://desktop.github.com/

### Step 2: Sign in to GitHub
Open GitHub Desktop and sign in with your GitHub account

### Step 3: Add Repository
1. Click "File" → "Add Local Repository"
2. Browse to your project folder: `C:\Users\prem.pradeep\Downloads\Dark Patterns`
3. If it says "not a git repository", click "Create a repository"
4. Click "Publish repository"
5. Set repository name to "darkpatterns"
6. Uncheck "Keep this code private" if you want it public
7. Click "Publish repository"

---

## Option 3: GitHub Web Interface (No Installation)

### Step 1: Create Repository
1. Go to https://github.com/prempradip/darkpatterns
2. If it doesn't exist, create it at https://github.com/new

### Step 2: Upload Files
1. Click "uploading an existing file" or "Add file" → "Upload files"
2. Drag and drop these files from your folder:
   - index.html
   - styles.css
   - script.js
   - scoring-logic.js
   - pattern-detection-rules.js
   - pattern-severity-index.js
   - export-report.js
   - README.md
   - .gitignore
   - PUSH_TO_GITHUB.md

3. Add commit message: "Initial commit: Dark Pattern Detector with PES system"
4. Click "Commit changes"

---

## Option 4: VS Code with Git Extension

If you're using VS Code:

1. Install Git from https://git-scm.com/download/win
2. Restart VS Code
3. Open your project folder
4. Click the Source Control icon (left sidebar)
5. Click "Initialize Repository"
6. Stage all changes (click + next to "Changes")
7. Enter commit message: "Initial commit: Dark Pattern Detector"
8. Click the checkmark to commit
9. Click "..." → "Remote" → "Add Remote"
10. Enter: https://github.com/prempradip/darkpatterns.git
11. Click "..." → "Push"

---

## Files to Push

Make sure these files are in your folder:

✓ index.html
✓ styles.css
✓ script.js
✓ scoring-logic.js
✓ pattern-detection-rules.js
✓ pattern-severity-index.js
✓ export-report.js
✓ README.md
✓ .gitignore
✓ PUSH_TO_GITHUB.md

---

## Troubleshooting

### If repository already exists with content:
```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

### If you get authentication errors:
Use a Personal Access Token instead of password:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with "repo" permissions
3. Use token as password when pushing

### If you want to overwrite everything on GitHub:
```bash
git push -f origin main
```

---

## Quick Start (After Installing Git)

```bash
cd "C:\Users\prem.pradeep\Downloads\Dark Patterns"
git init
git add .
git commit -m "Initial commit: Dark Pattern Detector with PES system"
git remote add origin https://github.com/prempradip/darkpatterns.git
git branch -M main
git push -u origin main
```

---

## Need Help?

If you encounter any issues:
1. Check if Git is installed: `git --version`
2. Check if you're in the right folder: `pwd` or `cd`
3. Check your GitHub credentials
4. Make sure the repository URL is correct

For more help, visit: https://docs.github.com/en/get-started
