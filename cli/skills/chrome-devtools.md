---
name: browser-cli
description: Browser automation and debugging through Chrome DevTools Protocol CLI commands. Use when controlling a Chrome session with remote debugging, navigating pages, listing tabs, selecting pages, taking screenshots, inspecting DOM state, or running CDP-style browser actions instead of the headless-browser CLI.
---

# Chrome DevTools Skill

This skill enables browser automation and debugging using Chrome DevTools Protocol via MCP.

## Quick Start

### Prerequisites

Chrome must be running with remote debugging enabled:

```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile-stable

# Linux
/usr/bin/google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile-stable

# Windows
chrome.exe --remote-debugging-port=9222 --user-data-dir=%TEMP%\chrome-profile-stable
```

### Installation

```bash
npm install
npm link
```

## Key Concepts

### Page IDs
Commands that accept URLs and navigate to them will return a page ID (page number). This ID can be used with page management commands like `select-page` and `close-page`. Page IDs are simple numbers (1, 2, 3...) assigned by Chrome.

**Example:**
```bash
cdp-cli navigate https://example.com
# Output: Page ID: 1

cdp-cli screenshot output.png https://github.com
# Output: Page ID: 2

# Use these IDs to manage pages
cdp-cli select-page 1
cdp-cli close-page 2
```

### Persistent Browser Session
All commands work with the same Chrome instance. The browser stays open between commands, allowing you to:
- Navigate once, then take multiple screenshots/snapshots
- Build up page state across multiple commands
- Inspect and interact with the current page without re-navigating

### Element UIDs
Interaction commands (click, hover, fill) require element UIDs from snapshots, not CSS selectors. This ensures reliable element targeting through Chrome's accessibility tree.

## Available Commands

### Navigation & Page Management

#### Navigate to URL
```bash
cdp-cli navigate <url>
```
Navigate to any URL in Chrome. Returns the page ID (page number) of the navigated page.

**Example:**
```bash
cdp-cli navigate https://example.com
# Output includes: Page ID: 1
```

#### List Open Pages
```bash
cdp-cli pages
# or
cdp-cli list-pages
```
List all open browser tabs/pages with their IDs and URLs. Returns page numbers (1, 2, 3...) that can be used with other page management commands.

#### Create New Page
```bash
cdp-cli new-page <url>
```
Open a new browser tab and navigate to URL.

**Example:**
```bash
cdp-cli new-page https://github.com
```

#### Select Page
```bash
cdp-cli select-page <pageId>
```
Switch to a specific page using its ID from `pages` command.

#### Close Page
```bash
cdp-cli close-page <pageId>
```
Close a specific page using its ID.

### Debugging & Inspection

#### Take Screenshot
```bash
cdp-cli screenshot <output.png> [url]
```
Capture a screenshot. Output filename is required. If URL is provided, navigates first and returns the page ID. Otherwise, captures current page.

**Examples:**
```bash
# Screenshot current page (no navigation)
cdp-cli navigate https://example.com
cdp-cli screenshot current-page.png

# Navigate and screenshot (returns page ID)
cdp-cli screenshot homepage.png https://example.com
# Output: Page ID: 1
```

**Note:** Screenshots are saved relative to your current directory. The full path is displayed after saving.

#### DOM Snapshot
```bash
cdp-cli snapshot [url]
```
Capture accessibility tree snapshot with element UIDs. If URL is provided, navigates first and returns the page ID. Otherwise, captures current page.

**Example:**
```bash
# Navigate and snapshot (returns page ID)
cdp-cli snapshot https://example.com
# Output: Page ID: 1

# Snapshot current page
cdp-cli navigate https://example.com
cdp-cli snapshot
```

**Output shows elements with UIDs:**
```
uid: "123" role: "button" name: "Submit"
uid: "456" role: "textbox" name: "Email"
uid: "789" role: "link" name: "More information"
```

**Use these UIDs for interaction commands (click, hover, fill).**

#### Console Logs
```bash
cdp-cli console [url]
```
Capture and display console messages (logs, warnings, errors). If URL is provided, navigates first. Otherwise, captures from current page.

**Examples:**
```bash
# Console logs from current page
cdp-cli navigate https://myapp.com
cdp-cli console

# Navigate and get console logs
cdp-cli console https://myapp.com
```

#### Execute JavaScript
```bash
cdp-cli evaluate <function> [url]
```
Execute JavaScript function. Function is required. If URL is provided, navigates first and returns the page ID. Otherwise, executes on current page.

**Examples:**
```bash
# Execute on current page
cdp-cli navigate https://example.com
cdp-cli evaluate "() => document.title"

# Navigate and execute (returns page ID)
cdp-cli evaluate "() => document.title" https://example.com
# Output: Page ID: 1

# Count links on current page
cdp-cli evaluate "() => document.querySelectorAll('a').length"

# Get computed style
cdp-cli evaluate "() => getComputedStyle(document.body).backgroundColor"
```

### Performance & Auditing

#### Performance Analysis
```bash
cdp-cli performance <url>
```
Analyze page performance with Chrome DevTools traces. Provides metrics like LCP, FID, CLS.

**Example:**
```bash
cdp-cli performance https://developers.chrome.com
```

#### Lighthouse Audit
```bash
cdp-cli lighthouse <url>
```
Run comprehensive Lighthouse audit covering performance, accessibility, best practices, and SEO. Returns the page ID after navigation.

**Example:**
```bash
cdp-cli lighthouse https://example.com
# Output: Page ID: 1
```

**Note:** Lighthouse audits take 30-60 seconds to complete.

#### Network Monitoring
```bash
cdp-cli network [url]
```
Capture network requests. If URL is provided, navigates first. Otherwise, captures from current page.

**Examples:**
```bash
# Network requests from current page
cdp-cli navigate https://example.com
cdp-cli network

# Navigate and capture network
cdp-cli network https://example.com
```

### Element Interaction

**Important:** Interaction commands require element UIDs from the snapshot command, not CSS selectors.

#### Workflow for Interaction
1. First, get element UIDs:
```bash
cdp-cli snapshot https://example.com
```

2. Find the element you want to interact with in the output (look for `uid: "xxx"`)

3. Use that UID in interaction commands:

#### Click Element
```bash
cdp-cli click <url> <uid>
```
Click an element and returns the page ID after navigation.

**Example:**
```bash
# Get UIDs first
cdp-cli snapshot https://example.com
# Output: uid: "123" role: "link" name: "More information"

# Click that element (returns page ID)
cdp-cli click https://example.com "123"
# Output: Page ID: 1
```

#### Hover Element
```bash
cdp-cli hover <url> <uid>
```
Hover over an element to trigger tooltips, dropdowns, etc. Returns the page ID after navigation.

**Example:**
```bash
cdp-cli hover https://example.com "456"
# Output: Page ID: 1
```

#### Fill Input
```bash
cdp-cli fill <url> <uid> <value>
```
Fill an input field, textarea, or select element. Returns the page ID after navigation.

**Example:**
```bash
# Get input field UID from snapshot
cdp-cli snapshot https://www.google.com
# Output: uid: "789" role: "textbox" name: "Search"

# Fill the input (returns page ID)
cdp-cli fill https://www.google.com "789" "test query"
# Output: Page ID: 1
```

### Device Emulation

#### Emulate Device
```bash
cdp-cli emulate <url> "<device>"
```
Emulate mobile devices or tablets with proper viewport and user agent.

**Supported Devices:**
- iPhone 12, iPhone 13, iPhone 14
- iPad Pro, iPad Mini
- Pixel 5, Pixel 7
- Galaxy S21, Galaxy S22
- And many more...

**Examples:**
```bash
cdp-cli emulate https://example.com "iPhone 12"
cdp-cli emulate https://example.com "iPad Pro"
cdp-cli emulate https://example.com "Pixel 5"
```

## Common Use Cases

### 1. E2E Testing Workflow
```bash
# Navigate to login page
cdp-cli navigate https://myapp.com/login

# Get element UIDs
cdp-cli snapshot

# Fill login form (using UIDs from snapshot)
cdp-cli fill https://myapp.com/login "email-uid" "user@example.com"
cdp-cli fill https://myapp.com/login "password-uid" "password123"

# Click submit button
cdp-cli click https://myapp.com/login "submit-uid"

# Verify success
cdp-cli console https://myapp.com/dashboard
```

### 2. Performance Monitoring
```bash
# Analyze performance
cdp-cli performance https://myapp.com

# Run full Lighthouse audit
cdp-cli lighthouse https://myapp.com

# Check network requests
cdp-cli network https://myapp.com
```

### 3. Visual Regression Testing
```bash
# Capture baseline
cdp-cli screenshot baseline.png https://myapp.com/dashboard

# Make changes...

# Capture new version
cdp-cli screenshot current.png https://myapp.com/dashboard

# Compare images externally
```

### 4. Mobile Responsiveness Testing
```bash
# Test on iPhone
cdp-cli emulate https://myapp.com "iPhone 12"
cdp-cli screenshot mobile-iphone.png

# Test on iPad
cdp-cli emulate https://myapp.com "iPad Pro"
cdp-cli screenshot mobile-ipad.png

# Test on Android
cdp-cli emulate https://myapp.com "Pixel 5"
cdp-cli screenshot mobile-android.png
```

### 5. Debugging JavaScript Errors
```bash
# Check console for errors
cdp-cli console https://myapp.com

# Execute debug script
cdp-cli evaluate https://myapp.com "() => { console.log('Debug info:', window.myApp); return window.myApp; }"

# Take DOM snapshot to inspect structure
cdp-cli snapshot https://myapp.com
```

### 6. Multi-Page Workflows
```bash
# Open multiple pages
cdp-cli new-page https://example.com
cdp-cli new-page https://github.com
cdp-cli new-page https://stackoverflow.com

# List all pages
cdp-cli pages

# Switch between pages (use IDs from pages output)
cdp-cli select-page <page-id-1>
cdp-cli screenshot page1.png

cdp-cli select-page <page-id-2>
cdp-cli screenshot page2.png
```

### 7. Form Automation
```bash
# Navigate to form
cdp-cli navigate https://forms.example.com

# Get form element UIDs
cdp-cli snapshot

# Fill all fields
cdp-cli fill https://forms.example.com "name-uid" "John Doe"
cdp-cli fill https://forms.example.com "email-uid" "john@example.com"
cdp-cli fill https://forms.example.com "message-uid" "Hello World"

# Submit form
cdp-cli click https://forms.example.com "submit-uid"

# Verify submission
cdp-cli console https://forms.example.com/success
```

### 8. Persistent Session Workflow
```bash
# Navigate once
cdp-cli navigate https://example.com

# Take multiple actions without re-navigating
cdp-cli snapshot                    # Get current page structure
cdp-cli screenshot page1.png        # Screenshot current state
cdp-cli console                     # Check console logs
cdp-cli network                     # Check network requests
cdp-cli evaluate "() => document.title"  # Run JavaScript

# Navigate to another page
cdp-cli navigate https://example.com/about

# Continue working with new page
cdp-cli snapshot
cdp-cli screenshot page2.png
cdp-cli evaluate "() => document.querySelectorAll('h1').length"
```

## How It Works

The CLI connects to the chrome-devtools-mcp server, which provides access to Chrome DevTools Protocol through a standardized MCP interface. This allows programmatic control of Chrome for testing, debugging, and automation.

**Architecture:**
```
CLI (MCP Client) → MCP Server (chrome-devtools-mcp) → Chrome (port 9222)
```

**Key Features:**
- Persistent browser session across commands
- Element interaction via accessibility tree UIDs
- Full Chrome DevTools Protocol access
- Automatic error handling and validation

## Tips & Best Practices

### Element Interaction
- Always run `snapshot` first to get current element UIDs
- UIDs are unique per page load - get fresh UIDs after navigation
- Use descriptive element roles/names from snapshot to identify correct UIDs
- Wait for dynamic content to load before taking snapshots

### Persistent Sessions
- Chrome stays open between commands - no need to re-navigate
- Take advantage of this for multi-step workflows
- Use `snapshot` without URL to inspect current page
- Use `screenshot` without URL to capture current page

### Performance Testing
- Run performance tests multiple times for consistent results
- Clear cache between tests for accurate measurements
- Use headless mode for CI/CD environments
- Compare results against baseline metrics

### Screenshots
- Screenshots are saved relative to current directory
- Full path is displayed after saving
- Use consistent viewport sizes for comparison
- Consider using device emulation for mobile screenshots
- Can screenshot current page without re-navigating

### Network Debugging
- Network logs capture all requests since page load
- Check for failed requests (4xx, 5xx status codes)
- Monitor request sizes for performance optimization
- Use network logs to debug API issues

### Console Logs
- Console logs include errors, warnings, and info messages
- Source-mapped stack traces are included when available
- Check console logs to debug JavaScript errors
- Logs are captured from page load until command execution

### Lighthouse Audits
- Audits take 30-60 seconds to complete
- Run in headless mode for consistent results
- Focus on actionable recommendations
- Track scores over time to measure improvements

## Troubleshooting

### Chrome Not Connected
```bash
# Verify Chrome is running with remote debugging
curl http://127.0.0.1:9222/json/version

# If not, start Chrome with the correct flags
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile-stable
```

**Error Message:**
```
✗ Error: Chrome is not running with remote debugging enabled.
```

**Solution:** Start Chrome with the command shown above before running any CLI commands.

### Element Not Found
```bash
# Get fresh snapshot to see current elements
cdp-cli snapshot

# Verify the UID exists in the snapshot output
# UIDs change after navigation - always get fresh UIDs
```

### Screenshot Not Saved
- Check the full path displayed in the output
- Ensure you have write permissions in the current directory
- Verify the file extension is .png, .jpg, or .webp

### Command Hangs
- Ensure Chrome is running and accessible
- Check that the MCP server can connect to Chrome
- Try closing and restarting Chrome

### Invalid Function Error
```bash
# Ensure evaluate uses function declaration syntax
# ✅ Correct: "() => document.title"
# ❌ Wrong: "document.title"

# ✅ Correct: "() => { return window.location.href; }"
# ❌ Wrong: "window.location.href"
```

## Advanced Usage

### Scripting with CDP CLI
```bash
#!/bin/bash

# Automated testing script
URL="https://myapp.com"

echo "Running automated tests..."

# Navigate once
cdp-cli navigate $URL

# Run multiple tests on same page
cdp-cli performance $URL > performance-report.txt
cdp-cli lighthouse $URL > lighthouse-report.txt
cdp-cli screenshot screenshot-$(date +%Y%m%d).png
cdp-cli console $URL | grep -i error > errors.txt

echo "Tests complete!"
```

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Run CDP CLI Tests
  run: |
    # Start Chrome in headless mode
    google-chrome --headless --remote-debugging-port=9222 --user-data-dir=/tmp/chrome &
    
    # Wait for Chrome to start
    sleep 2
    
    # Run tests
    cdp-cli performance https://myapp.com
    cdp-cli lighthouse https://myapp.com
    cdp-cli screenshot screenshot.png https://myapp.com
```

## Related Tools

- **chrome-devtools-mcp**: The MCP server providing CDP access
- **Puppeteer**: Alternative Node.js library for Chrome automation
- **Playwright**: Cross-browser automation framework
- **Selenium**: Traditional browser automation tool

## Resources

- [Chrome DevTools Protocol Documentation](https://chromedevtools.github.io/devtools-protocol/)
- [chrome-devtools-mcp GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
