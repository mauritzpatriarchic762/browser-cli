# CDP CLI Quick Start Guide

## 1. Start Chrome with Remote Debugging

```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-profile-stable

# Linux
google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile-stable

# Windows
chrome.exe --remote-debugging-port=9222 --user-data-dir=%TEMP%\chrome-profile-stable
```

## 2. Install CDP CLI

```bash
cd cli
npm install
npm link
```

## 3. Test Your Setup

```bash
# Verify Chrome is running
curl http://127.0.0.1:9222/json/version

# Take your first screenshot
cdp-cli screenshot test.png https://example.com
```

## 4. Common Commands Cheat Sheet

### Navigation
```bash
cdp-cli navigate https://example.com          # Go to URL
cdp-cli pages                                 # List open tabs
cdp-cli new-page https://github.com           # Open new tab
cdp-cli select-page 1                         # Switch to tab 1
cdp-cli close-page 2                          # Close tab 2
```

### Screenshots & Inspection
```bash
cdp-cli screenshot output.png                 # Screenshot current page
cdp-cli screenshot output.png https://url     # Navigate & screenshot
cdp-cli snapshot                              # Get DOM with element UIDs
cdp-cli console                               # Show console logs
```

### Interaction (requires element UIDs from snapshot)
```bash
cdp-cli snapshot                              # 1. Get UIDs first
cdp-cli click https://url "uid-123"           # 2. Click element
cdp-cli hover https://url "uid-456"           # 3. Hover element
cdp-cli fill https://url "uid-789" "text"     # 4. Fill input
```

### Network & Debugging
```bash
cdp-cli network                               # Network requests
```

### JavaScript Execution
```bash
cdp-cli evaluate "() => document.title"
cdp-cli evaluate "() => window.location.href"
cdp-cli evaluate "() => document.querySelectorAll('a').length"
```

## 5. Using with AI Assistants (OpenClaw Skill)

### Install the Skill
```bash
# For Kiro
cp SKILL.md ~/.kiro/skills/browser-cli.md
```

### Example AI Commands
- "Take a screenshot of example.com"
- "Test the login form on staging"
- "Check for console errors on the homepage"
- "Monitor network requests on the page"

## 6. Typical Workflow

### Manual Testing
```bash
# 1. Navigate to page
cdp-cli navigate https://myapp.com/login

# 2. Get element structure
cdp-cli snapshot

# 3. Interact with elements (use UIDs from step 2)
cdp-cli fill https://myapp.com/login "email-uid" "user@test.com"
cdp-cli fill https://myapp.com/login "pass-uid" "password"
cdp-cli click https://myapp.com/login "submit-uid"

# 4. Verify result
cdp-cli console
cdp-cli screenshot success.png
```

### Network Analysis
```bash
# Capture network requests
cdp-cli network https://myapp.com > network.txt
```

### Visual Regression
```bash
# Capture baseline
cdp-cli screenshot baseline.png https://myapp.com

# After changes
cdp-cli screenshot current.png https://myapp.com

# Compare externally (use image diff tool)
```

## 7. Troubleshooting

### Chrome not connected?
```bash
# Check if Chrome is running
curl http://127.0.0.1:9222/json/version

# If not, start Chrome with the command from step 1
```

### Element not found?
```bash
# Always get fresh UIDs after navigation
cdp-cli snapshot
# UIDs change between page loads
```

### Command hangs?
- Restart Chrome with debugging flags
- Check port 9222 is not blocked
- Ensure no other process is using port 9222

## 8. Next Steps

- Read [SKILL.md](SKILL.md) for comprehensive documentation
- Check [README.md](README.md) for detailed examples
- See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- Review [examples in SKILL.md](SKILL.md#common-use-cases)

## Quick Tips

✅ **DO:**
- Get fresh snapshots after navigation
- Use descriptive output filenames
- Check console logs for errors
- Monitor network requests for debugging

❌ **DON'T:**
- Reuse UIDs across page loads
- Forget to start Chrome with debugging
- Use CSS selectors (use UIDs instead)
- Run long audits without timeout consideration

## Need Help?

- 📖 Full documentation: [SKILL.md](SKILL.md)
- 🐛 Report issues: GitHub Issues
- 💬 Ask questions: GitHub Discussions
