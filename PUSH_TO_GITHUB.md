# Push to GitHub - Authentication Required

Your repository is connected to: https://github.com/vivek-ambariya/cattle_monitoring_system

## Option 1: Use Personal Access Token (Easiest)

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name it: "Cattle Monitoring System"
   - Select scope: **`repo`** (full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again!)

2. **Push using the token:**
   ```bash
   git push -u origin main
   ```
   - Username: `vivek-ambariya`
   - Password: **Paste your Personal Access Token** (not your GitHub password)

## Option 2: Use SSH (More Secure)

1. **Check if you have SSH key:**
   ```bash
   ls -la ~/.ssh/id_ed25519.pub
   ```

2. **If no SSH key, generate one:**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Press Enter to accept default location
   # Press Enter for no passphrase (or set one)
   ```

3. **Copy your public key:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

4. **Add SSH key to GitHub:**
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Title: "Cattle Monitoring System"
   - Paste your public key
   - Click "Add SSH key"

5. **Change remote to SSH:**
   ```bash
   git remote set-url origin git@github.com:vivek-ambariya/cattle_monitoring_system.git
   ```

6. **Push:**
   ```bash
   git push -u origin main
   ```

## Option 3: Use GitHub CLI

1. **Install GitHub CLI** (if not installed):
   ```bash
   brew install gh
   ```

2. **Authenticate:**
   ```bash
   gh auth login
   ```

3. **Push:**
   ```bash
   git push -u origin main
   ```

## Quick Command Reference

```bash
# Check remote connection
git remote -v

# Push to GitHub
git push -u origin main

# Check status
git status

# View commits
git log --oneline
```

## After Successful Push

Your code will be available at:
**https://github.com/vivek-ambariya/cattle_monitoring_system**

You can:
- View all your code online
- Share the repository with others
- Clone it on other machines
- Set up GitHub Actions for CI/CD
- Create issues and pull requests

## Troubleshooting

### "Authentication failed"
- Make sure you're using a Personal Access Token, not your password
- Token must have `repo` scope

### "Permission denied"
- Check you have write access to the repository
- Verify the repository name is correct

### "Repository not found"
- Verify the repository exists at: https://github.com/vivek-ambariya/cattle_monitoring_system
- Check you're logged into the correct GitHub account

