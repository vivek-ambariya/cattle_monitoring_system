# GitHub Setup Guide

## Step 1: Initialize Git (Already Done ✅)

Git repository has been initialized in your project.

## Step 2: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `cattle-monitoring-dashboard` (or your preferred name)
   - **Description**: "AI Cattle Monitoring Dashboard with React and Node.js"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 3: Add Files and Commit

Run these commands in your terminal:

```bash
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: AI Cattle Monitoring Dashboard"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/cattle-monitoring-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: If You Get Authentication Errors

### Option A: Use Personal Access Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` permissions
3. Use token as password when pushing

### Option B: Use SSH (Recommended)
1. Generate SSH key (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
2. Add SSH key to GitHub:
   - Copy your public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub → Settings → SSH and GPG keys → New SSH key
   - Paste your key
3. Use SSH URL instead:
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/cattle-monitoring-dashboard.git
   ```

## Quick Commands Summary

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull
```

## What's Included in the Repository

✅ All source code (React frontend + Node.js backend)
✅ Database schema files
✅ Configuration files
✅ README and documentation
❌ node_modules (excluded via .gitignore)
❌ .env file (excluded for security)
❌ Build files (excluded)

## Important Notes

- **Never commit `.env` file** - It contains sensitive database credentials
- **Add `.env.example`** - Shows required environment variables without actual values
- **Update README** - Make sure installation instructions are clear
- **Add LICENSE** - If you want to specify how others can use your code

## Next Steps After Pushing

1. Add a description to your GitHub repository
2. Add topics/tags: `react`, `nodejs`, `mysql`, `cattle-monitoring`, `dashboard`
3. Consider adding:
   - GitHub Actions for CI/CD
   - Issues template
   - Pull request template
   - Contributing guidelines

## Troubleshooting

### "Repository not found"
- Check repository name and username are correct
- Verify you have push access to the repository

### "Authentication failed"
- Use Personal Access Token or SSH key
- Check your GitHub credentials

### "Large file" errors
- Make sure node_modules is in .gitignore
- Use `git rm --cached` to remove accidentally added large files

