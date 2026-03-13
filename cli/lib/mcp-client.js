import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export class MCPClient {
  constructor() {
    this.client = null;
    this.transport = null;
  }

  async checkChromeRunning() {
    try {
      const response = await fetch('http://127.0.0.1:9222/json/version', {
        signal: AbortSignal.timeout(2000)
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async connect() {
    // Check if Chrome is running first
    const isRunning = await this.checkChromeRunning();
    
    if (!isRunning) {
      throw new Error(
        'Chrome is not running with remote debugging enabled.\n' +
        'Please start Chrome with:\n' +
        '  macOS: /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile-stable\n' +
        '  Linux: google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile-stable\n' +
        '  Windows: chrome.exe --remote-debugging-port=9222 --user-data-dir=%TEMP%\\chrome-profile-stable'
      );
    }

    this.transport = new StdioClientTransport({
      command: 'npx',
      args: ['-y', 'chrome-devtools-mcp@latest', '--browserUrl=http://127.0.0.1:9222']
    });

    this.client = new Client({
      name: 'cdp-cli',
      version: '1.0.0'
    }, {
      capabilities: {}
    });

    await this.client.connect(this.transport);
    return this.client;
  }

  async callTool(name, args) {
    if (!this.client) {
      await this.connect();
    }
    return await this.client.callTool({ name, arguments: args });
  }

  async close() {
    if (this.transport) {
      await this.transport.close();
    }
  }
}
