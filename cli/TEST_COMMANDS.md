# CDP CLI Test Commands

## Prerequisites

Start Chrome with remote debugging:

```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile-stable

# Linux
/usr/bin/google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile-stable

# Windows
chrome.exe --remote-debugging-port=9222 --user-data-dir=%TEMP%\chrome-profile-stable
```

## Quick Test (Run All)

```bash
chmod +x test-commands.sh
./test-commands.sh
```

## Individual Command Tests

### 1. Navigation
```bash
cdp-cli navigate https://example.com
```

### 2. Screenshot
```bash
cdp-cli screenshot https://example.com screenshot.png
```

### 3. DOM Snapshot
```bash
cdp-cli snapshot https://example.com
```

### 4. Console Logs
```bash
cdp-cli console https://developers.chrome.com
```

### 5. Execute JavaScript
```bash
cdp-cli evaluate https://example.com "document.title"
cdp-cli evaluate https://example.com "window.location.href"
cdp-cli evaluate https://example.com "document.querySelectorAll('a').length"
```

### 6. Network Requests
```bash
cdp-cli network https://example.com
```

### 7. Click Element
```bash
cdp-cli click https://example.com "a"
cdp-cli click https://github.com "button[aria-label='Search']"
```

### 8. Hover Element
```bash
cdp-cli hover https://example.com "h1"
cdp-cli hover https://github.com ".Header-link"
```

### 9. Fill Input
```bash
cdp-cli fill https://www.google.com "textarea[name=q]" "test query"
cdp-cli fill https://github.com/login "input[name=login]" "testuser"
```

### 10. Device Emulation
```bash
cdp-cli emulate https://example.com "iPhone 12"
cdp-cli emulate https://example.com "iPad Pro"
cdp-cli emulate https://example.com "Pixel 5"
```

### 11. Page Management
```bash
# List all open pages
cdp-cli pages

# Open new page
cdp-cli new-page https://github.com

# Select page (use ID from pages list)
cdp-cli select-page <page-id>

# Close page (use ID from pages list)
cdp-cli close-page <page-id>
```

### 12. Performance Analysis
```bash
cdp-cli performance https://developers.chrome.com
cdp-cli performance https://web.dev
```

### 13. Lighthouse Audit
```bash
cdp-cli lighthouse https://example.com
cdp-cli lighthouse https://developers.chrome.com
```

## Advanced Test Scenarios

### Test Form Automation
```bash
# Navigate and fill a form
cdp-cli navigate https://www.google.com
cdp-cli fill https://www.google.com "textarea[name=q]" "chrome devtools"
cdp-cli click https://www.google.com "input[name=btnK]"
```

### Test Mobile Responsiveness
```bash
# Test on different devices
cdp-cli emulate https://example.com "iPhone 12"
cdp-cli screenshot https://example.com mobile-iphone.png

cdp-cli emulate https://example.com "iPad Pro"
cdp-cli screenshot https://example.com mobile-ipad.png
```

### Test Performance Across Pages
```bash
cdp-cli performance https://example.com
cdp-cli performance https://github.com
cdp-cli performance https://developers.chrome.com
```

### Debug Console Errors
```bash
# Check for console errors on different pages
cdp-cli console https://example.com
cdp-cli console https://github.com
cdp-cli console https://developers.chrome.com
```

### Network Analysis
```bash
# Analyze network requests
cdp-cli network https://example.com
cdp-cli network https://github.com
```

### Multi-Page Workflow
```bash
# Open multiple pages and switch between them
cdp-cli new-page https://example.com
cdp-cli new-page https://github.com
cdp-cli pages
# Use page IDs from output to select/close
```

## Expected Results

- **navigate**: Should show "Navigation complete"
- **screenshot**: Should create a PNG file
- **snapshot**: Should show DOM tree with element UIDs
- **console**: Should list console messages (if any)
- **evaluate**: Should return JavaScript execution result
- **network**: Should list HTTP requests
- **click**: Should show "Click successful"
- **hover**: Should show "Hover successful"
- **fill**: Should show "Fill successful"
- **emulate**: Should show device emulation active
- **pages**: Should list all open browser pages
- **performance**: Should show performance metrics
- **lighthouse**: Should show audit scores

## Troubleshooting

If commands fail:

1. Verify Chrome is running with `--remote-debugging-port=9222`
2. Check Chrome is accessible at `http://127.0.0.1:9222/json/version`
3. Ensure selectors exist on the target page
4. Try with `--headless=false` to see what's happening
5. Check for console errors in the CLI output
