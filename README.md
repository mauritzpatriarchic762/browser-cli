# CDP CLI - Chrome DevTools Protocol Command Line Interface

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io/)
[![OpenClaw Skill](https://img.shields.io/badge/OpenClaw-Skill-purple)](SKILL.md)

A powerful CLI tool for browser automation and debugging using Chrome DevTools Protocol via the Model Context Protocol (MCP). Control Chrome programmatically from your terminal for testing, debugging, performance analysis, and automation.

**Designed for OpenClaw Skills**: This CLI is built to work seamlessly with AI assistants through the OpenClaw skill system, enabling AI-powered browser automation, testing, and debugging workflows.

📚 **[Quick Start Guide](QUICKSTART.md)** | 📖 **[Full Documentation](SKILL.md)**

## Features

- **Browser Automation**: Navigate, click, fill forms, and interact with web pages
- **Visual Testing**: Take screenshots and DOM snapshots
- **Network Debugging**: Monitor and analyze network requests
- **Console Monitoring**: Capture JavaScript console logs and errors
- **Multi-Page Management**: Work with multiple browser tabs simultaneously
- **Persistent Sessions**: Maintain browser state across commands
- **AI Assistant Integration**: Built for OpenClaw skills - works with Kiro, Claude, and other MCP-compatible AI assistants
- **Model Context Protocol**: Leverages MCP for standardized tool communication

## What is OpenClaw?

OpenClaw is a skill system that enables AI assistants to use specialized tools and capabilities. This CDP CLI is packaged as an OpenClaw skill, allowing AI assistants like Kiro to:

- Automate browser testing workflows
- Debug web applications interactively
- Perform visual regression testing
- Analyze performance and accessibility
- Execute complex multi-step browser automation

The skill is defined in [SKILL.md](SKILL.md), which provides comprehensive documentation for AI assistants on how to use each command effectively.

## Quick Start

**New to CDP CLI?** Check out the [Quick Start Guide](QUICKSTART.md) for a step-by-step walkthrough.

### Prerequisites

1. **Node.js** (v16 or higher)
2. **Chrome** with remote debugging enabled:

```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-profile-stable

# Linux
google-chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-profile-stable

# Windows
chrome.exe \
  --remote-debugging-port=9222 \
  --user-data-dir=%TEMP%\chrome-profile-stable
```

### Installation

```bash
cd cli
npm install
npm link
```

Now you can use `cdp-cli` from anywhere in your terminal.

### Using with AI Assistants (OpenClaw Skill)

This CLI is designed to work with AI assistants through the OpenClaw skill system:

1. **Place the skill file**: Copy `SKILL.md` to your AI assistant's skills directory:
   ```bash
   # For Kiro
   cp SKILL.md ~/.kiro/skills/browser-cli.md
   # or workspace-level
   cp SKILL.md .kiro/skills/browser-cli.md
   ```

2. **Start Chrome** with remote debugging (as shown above)

3. **Ask your AI assistant** to perform browser automation tasks:
   - "Take a screenshot of example.com"
   - "Test the login flow on staging"
   - "Check console errors on the homepage"
   - "Monitor network requests on the page"

The AI assistant will use the CDP CLI commands to accomplish these tasks automatically.

## Usage

### Navigation & Page Management

```bash
# Navigate to a URL
cdp-cli navigate https://example.com

# List all open tabs
cdp-cli pages

# Open a new tab
cdp-cli new-page https://github.com

# Switch between tabs
cdp-cli select-page 1

# Close a tab
cdp-cli close-page 2
```

### Screenshots & Snapshots

```bash
# Take a screenshot
cdp-cli screenshot output.png https://example.com

# Screenshot current page (no navigation)
cdp-cli screenshot current.png

# Get DOM snapshot with element UIDs
cdp-cli snapshot https://example.com
```

### Element Interaction

```bash
# 1. Get element UIDs from snapshot
cdp-cli snapshot https://example.com

# 2. Use UIDs to interact with elements
cdp-cli click https://example.com "uid-123"
cdp-cli hover https://example.com "uid-456"
cdp-cli fill https://example.com "uid-789" "text value"
```

### Debugging

```bash
# Monitor network requests
cdp-cli network https://example.com

# Capture console logs
cdp-cli console https://example.com

# Execute JavaScript
cdp-cli evaluate "() => document.title" https://example.com
```

## AI-Powered Use Cases

When used with AI assistants through OpenClaw skills, you can accomplish complex tasks with natural language:

### Automated Testing Workflows
**You say:** "Test the login flow on staging.example.com with user@test.com"

**AI does:**
1. Navigates to the login page
2. Takes a snapshot to find form elements
3. Fills in email and password fields
4. Clicks the submit button
5. Verifies successful login
6. Reports any console errors

### Visual Regression Detection
**You say:** "Compare the homepage design between staging and production"

**AI does:**
1. Takes screenshots of both environments
2. Provides file paths for comparison
3. Helps identify visual differences

### Network Analysis
**You say:** "Check what API calls are made on the homepage"

**AI does:**
1. Navigates to the page
2. Captures network requests
3. Filters and analyzes API calls
4. Reports findings and potential issues

## Common Use Cases

### E2E Testing

```bash
# Navigate to login page
cdp-cli navigate https://myapp.com/login

# Get form element UIDs
cdp-cli snapshot

# Fill and submit form
cdp-cli fill https://myapp.com/login "email-uid" "user@example.com"
cdp-cli fill https://myapp.com/login "password-uid" "password123"
cdp-cli click https://myapp.com/login "submit-uid"

# Verify success
cdp-cli console
```

### Visual Regression Testing

```bash
# Capture baseline
cdp-cli screenshot baseline.png https://myapp.com

# After changes, capture new version
cdp-cli screenshot current.png https://myapp.com

# Compare images with your preferred tool
```

### Network Monitoring

```bash
# Capture network requests
cdp-cli network https://myapp.com > network-report.txt
```

## Architecture

```
AI Assistant (e.g., Kiro, Claude)
    ↓
OpenClaw Skill (SKILL.md)
    ↓
CDP CLI (MCP Client)
    ↓
chrome-devtools-mcp (MCP Server)
    ↓
Chrome DevTools Protocol
    ↓
Chrome Browser (port 9222)
```

The CLI uses the Model Context Protocol to communicate with the chrome-devtools-mcp server, which provides a standardized interface to Chrome DevTools Protocol. When used as an OpenClaw skill, AI assistants can orchestrate complex browser automation workflows by invoking CLI commands based on natural language instructions.

## Commands Reference

### Navigation
- `navigate <url>` - Navigate to a URL
- `pages` / `list-pages` - List all open pages
- `new-page <url>` - Open a new page
- `select-page <pageId>` - Switch to a specific page
- `close-page <pageId>` - Close a specific page

### Debugging
- `screenshot <output> [url]` - Take a screenshot
- `snapshot [url]` - Take a DOM snapshot
- `console [url]` - Capture console logs
- `evaluate <function> [url]` - Execute JavaScript
- `network [url]` - Capture network requests

### Interaction
- `click <url> <uid>` - Click an element
- `hover <url> <uid>` - Hover over an element
- `fill <url> <uid> <value>` - Fill an input field

## Troubleshooting

### Chrome Not Connected

**Error:** `Chrome is not running with remote debugging enabled`

**Solution:** Start Chrome with the remote debugging flag:

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-profile-stable
```

Verify Chrome is running:
```bash
curl http://127.0.0.1:9222/json/version
```

### Element Not Found

Always get fresh element UIDs from `snapshot` after navigation, as UIDs change between page loads.

### Command Hangs

- Ensure Chrome is running and accessible on port 9222
- Try restarting Chrome with the debugging flags
- Check that no firewall is blocking port 9222

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details

## OpenClaw Skill Integration

### For AI Assistant Developers

This project includes a comprehensive skill definition in `SKILL.md` that provides:

- **Command documentation**: Detailed usage for each CLI command
- **Workflow examples**: Common patterns for browser automation
- **Best practices**: Tips for reliable element interaction and testing
- **Troubleshooting**: Solutions to common issues
- **Key concepts**: Understanding page IDs, element UIDs, and persistent sessions

### For Users

To enable this skill in your AI assistant:

1. **Kiro**: Place `SKILL.md` in `~/.kiro/skills/` or `.kiro/skills/`
2. **Other MCP-compatible assistants**: Follow your assistant's skill installation process
3. **Verify**: Ask your assistant "Can you take a screenshot of example.com?"

### Skill Capabilities

The skill enables AI assistants to:
- Execute browser automation tasks from natural language
- Chain multiple commands for complex workflows
- Handle errors and retry with different approaches
- Provide context-aware suggestions
- Debug issues interactively
- Monitor network activity and console logs

## Related Projects

- [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) - The MCP server this CLI uses
- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol specification
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) - The underlying protocol
- [OpenClaw](https://github.com/openclaw) - Skill system for AI assistants
- [Kiro](https://kiro.ai/) - AI-powered IDE with skill support

## Resources

### Documentation
- [SKILL.md](SKILL.md) - Complete skill documentation for AI assistants
- [Chrome DevTools Protocol Documentation](https://chromedevtools.github.io/devtools-protocol/)
- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)

### Tutorials
- [Getting Started with OpenClaw Skills](https://github.com/openclaw/docs)
- [Browser Automation with AI Assistants](SKILL.md#common-use-cases)
- [MCP Integration Guide](https://modelcontextprotocol.io/docs)

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the [SKILL.md](SKILL.md) file for detailed usage examples
- Join the OpenClaw community discussions

## FAQ

### What is the difference between using CDP CLI directly vs through an AI assistant?

**Direct CLI usage** is great for:
- Scripting and automation
- CI/CD pipelines
- Quick manual testing
- Debugging specific issues

**AI assistant usage** (via OpenClaw skill) is great for:
- Natural language commands
- Complex multi-step workflows
- Exploratory testing
- Learning and experimentation
- Context-aware suggestions

### Can I use this without an AI assistant?

Yes! The CLI works perfectly as a standalone tool. The OpenClaw skill integration is optional and adds AI-powered capabilities on top of the core CLI functionality.

### Which AI assistants support OpenClaw skills?

- **Kiro**: Full support with skill system
- **Claude Desktop**: Via MCP integration
- **Other MCP-compatible assistants**: Check your assistant's documentation

### Do I need to install chrome-devtools-mcp separately?

No! The CLI automatically downloads and runs chrome-devtools-mcp via `npx` when needed. You only need to ensure Chrome is running with remote debugging enabled.

### Can I use this in CI/CD pipelines?

Absolutely! The CLI is designed for automation. Run Chrome in headless mode and execute CDP CLI commands in your CI/CD scripts. See the [CI/CD Integration example](SKILL.md#cicd-integration) in SKILL.md.

## Acknowledgments

- Built on [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) by the Chrome DevTools team
- Uses the [Model Context Protocol](https://modelcontextprotocol.io/) for standardized communication
- Inspired by the OpenClaw skill ecosystem
- Powered by [Commander.js](https://github.com/tj/commander.js/) for CLI parsing
