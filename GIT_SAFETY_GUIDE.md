# 🛡️ Git Safety Guide for DropCard Project

## ⚠️ **Never Let Anyone Use These Dangerous Commands:**

### **🚨 FORBIDDEN COMMANDS:**
```bash
# NEVER ALLOW THESE - They destroy your work permanently:
git reset --hard [commit]     # Destroys all uncommitted changes
git clean -fd                 # Deletes all untracked files
git rebase -i [commit]        # Can rewrite history and lose commits
git filter-branch             # Rewrites entire repository history
git push --force              # Overwrites remote history
```

## 🛡️ **Safety Measures Before Any Git Operations:**

### **1. Always Create Backup Branches**
```bash
# Before ANY risky git operation, create a backup:
git checkout -b backup-$(date +%Y%m%d-%H%M) 
git checkout main

# Examples:
git checkout -b backup-20250104-1530
git checkout -b backup-before-cleanup
git checkout -b backup-before-merge
```

### **2. Use Git Stash for Quick Safety**
```bash
# Before any destructive operations:
git stash push -m "backup before [operation]"

# To restore if things go wrong:
git stash list                # See all stashes
git stash pop                 # Restore latest stash
git stash apply stash@{0}     # Apply specific stash without removing it
```

### **3. Check What Will Be Lost**
```bash
# Before any reset/rebase, see what you'll lose:
git log --oneline main..HEAD     # See commits that will be lost
git diff HEAD~1                  # See changes that will be lost
git status                       # See uncommitted changes
```

## ✅ **Safe Git Commands to Use Instead:**

### **Safe Alternatives to Dangerous Commands:**
```bash
# Instead of: git reset --hard
git stash                     # Temporarily save changes
git checkout -- .             # Discard changes (safer)

# Instead of: git push --force  
git push --force-with-lease   # Safer force push

# Instead of: git rebase -i
git merge                     # Safer than rebasing
```

### **Safe Ways to Undo Things:**
```bash
# Undo last commit but keep changes:
git reset --soft HEAD~1

# Undo changes to specific file:
git checkout HEAD -- filename

# Create new commit that undoes previous commit:
git revert HEAD
```

## 🔄 **Recovery Procedures:**

### **If Code Gets Lost:**
1. **Check git reflog first:**
   ```bash
   git reflog                    # Shows all recent actions
   git checkout [lost-commit]    # Recover lost commit
   ```

2. **Check stashes:**
   ```bash
   git stash list
   git stash show stash@{0}
   git stash apply stash@{0}
   ```

3. **Check backup branches:**
   ```bash
   git branch -a                 # List all branches
   git checkout backup-20250104-1530
   ```

## 📋 **Pre-Operation Checklist:**

Before any major Git operation, always:

- [ ] Create backup branch: `git checkout -b backup-$(date +%Y%m%d-%H%M)`
- [ ] Stash current work: `git stash push -m "backup before operation"`
- [ ] Check what will be affected: `git status` and `git log --oneline`
- [ ] Verify you're on the right branch: `git branch`
- [ ] Have a recovery plan ready

## 🚨 **Emergency Recovery Commands:**

### **If You Accidentally Run a Dangerous Command:**

1. **Don't panic - check reflog immediately:**
   ```bash
   git reflog                    # Find your lost commits
   git reset --hard HEAD@{1}    # Go back to previous state
   ```

2. **If reflog doesn't help, check backup branches:**
   ```bash
   git branch -a
   git checkout backup-[timestamp]
   git checkout -b recovery-branch
   ```

3. **If all else fails, check remote:**
   ```bash
   git fetch origin
   git reset --hard origin/main  # Reset to last pushed version
   ```

## 📝 **Best Practices:**

### **Daily Workflow:**
1. Always commit frequently with meaningful messages
2. Push to remote regularly (at least daily)
3. Create feature branches for major changes
4. Never work directly on main for experimental changes

### **Before Major Changes:**
1. Create backup branch
2. Test changes on feature branch first
3. Only merge to main when confident
4. Keep main branch stable and deployable

### **When Working with Others:**
1. Always pull before pushing: `git pull origin main`
2. Use `git push --force-with-lease` instead of `--force`
3. Communicate before any history-changing operations
4. Keep commits atomic and well-documented

## 🎯 **DropCard-Specific Safety Rules:**

### **For TestFlight Builds:**
- Always tag successful builds: `git tag v1.0.13-build16`
- Keep production-ready commits on main branch
- Test locally before pushing to GitHub
- Never push untested code to main

### **For API Keys and Secrets:**
- Never commit real API keys to any branch
- Use `.env.local` for development secrets (gitignored)
- Always use placeholder values in example files
- Check commits before pushing: `git show HEAD`

### **For Mobile Development:**
- Keep `ios/` and `android/` folders in sync with main
- Never force push mobile-specific changes
- Test builds locally before pushing
- Keep EAS configuration files backed up

## 🔗 **Useful Git Aliases:**

Add these to your `~/.gitconfig` for safer operations:

```bash
[alias]
    # Safe operations
    unstage = reset HEAD --
    uncommit = reset --soft HEAD~1
    save = stash push -m
    
    # Information commands
    graph = log --oneline --graph --decorate --all
    changed = diff --name-only HEAD~1
    
    # Safety checks
    check = status --porcelain
    backup = !git checkout -b backup-$(date +%Y%m%d-%H%M)
```

## 📞 **When to Ask for Help:**

Stop and ask for help if you need to:
- Rewrite git history
- Force push to shared branches
- Recover lost commits older than 30 days
- Merge complex conflicts
- Change commit messages in pushed commits

---

**Remember: It's always better to be overly cautious with Git than to lose hours of work!**

*Last updated: January 4, 2025*