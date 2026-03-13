# CDP CLI

A CLI tool that uses Chrome DevTools Protocol via MCP (Model Context Protocol).

## Prerequisites

1. Start Chrome with remote debugging enabled:

```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile-stable

# Linux
/usr/bin/google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile-stable

# Windows
chrome.exe --remote-debugging-port=9222 --user-data-dir=%TEMP%\chrome-profile-stable
```

## Installation

```bash
npm install
npm link
```

## Commands

### Navigation
```bash
cdp-cli navigate <url>                    # Navigate to a URL
cdp-cli pages                             # List all open pages
cdp-cli new-page <url>                    # Open a new page
cdp-cli select-page <pageId>              # Switch to a specific page
cdp-cli close-page <pageId>               # Close a specific page
```

### Debugging
```bash
cdp-cli screenshot <url> <output.png>     # Take a screenshot
cdp-cli snapshot <url>                    # Take a DOM snapshot
cdp-cli console <url>                     # Capture console logs
cdp-cli evaluate <url> <script>           # Execute JavaScript
```

### Performance & Auditing
```bash
cdp-cli performance <url>                 # Analyze performance
cdp-cli lighthouse <url>                  # Run Lighthouse audit
cdp-cli network <url>                     # Capture network requests
```

### Interaction
```bash
# First, get element UIDs from snapshot
cdp-cli snapshot <url>

# Then use the UIDs for interaction
cdp-cli click <url> <uid>                 # Click an element
cdp-cli hover <url> <uid>                 # Hover over an element
cdp-cli fill <url> <uid> <value>          # Fill an input field
```

### Emulation
```bash
cdp-cli emulate <url> <device>            # Emulate a device (e.g., "iPhone 12")
```

## Examples

```bash
# Run Lighthouse audit
cdp-cli lighthouse https://example.com

# Emulate mobile device
cdp-cli emulate https://example.com "iPhone 12"

# Get page snapshot with element UIDs
cdp-cli snapshot https://example.com

# Use UID from snapshot to interact
cdp-cli click https://example.com "uid-123"
cdp-cli fill https://example.com "uid-456" "test value"

# Execute JavaScript function
cdp-cli evaluate https://example.com "() => document.title"
cdp-cli evaluate https://example.com "() => window.location.href"

# Take DOM snapshot
cdp-cli snapshot https://example.com

# Hover to trigger tooltips (use UID from snapshot)
cdp-cli hover https://example.com "uid-789"
```

## Available Tools

Based on chrome-devtools-mcp:

**Input automation**: click, drag, fill, fill_form, handle_dialog, hover, press_key, type_text, upload_file

**Navigation**: close_page, list_pages, navigate_page, new_page, select_page, wait_for

**Emulation**: emulate, resize_page

**Performance**: performance_analyze_insight, performance_start_trace, performance_stop_trace, take_memory_snapshot

**Network**: get_network_request, list_network_requests

**Debugging**: evaluate_script, get_console_message, lighthouse_audit, list_console_messages, take_screenshot, take_snapshot

## Architecture

```
CLI (MCP Client) → MCP Server (chrome-devtools-mcp) → Chrome (port 9222)
```
