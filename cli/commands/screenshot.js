import { getClient, closeClient } from '../lib/shared-client.js';
import { resolve } from 'path';
import { extractPageId } from '../lib/parse-response.js';

export async function screenshot(url, output) {
  if (!output) {
    console.error('✗ Error: Output path is required');
    console.error('Usage: cdp-cli screenshot [url] <output.png>');
    process.exit(1);
  }

  try {
    const client = await getClient();
    let pageId;
    
    // If URL provided, navigate to it first
    if (url) {
      console.log(`Taking screenshot of ${url}...`);
      const navResult = await client.callTool('navigate_page', { url });
      pageId = extractPageId(navResult);
      await client.callTool('wait_for', { duration: 1000 });
    } else {
      console.log('Taking screenshot of current page...');
    }
    
    const result = await client.callTool('take_screenshot', { 
      filePath: output
    });
    
    const fullPath = resolve(output);
    console.log(`✓ Screenshot saved to ${fullPath}`);
    if (result?.content?.[0]?.text) {
      console.log(result.content[0].text);
    }
    if (pageId) {
      console.log(`Page ID: ${pageId}`);
      return pageId;
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await closeClient();
  }
}
