import { getClient, closeClient } from '../lib/shared-client.js';
import { extractPageId } from '../lib/parse-response.js';

export async function click(url, uid) {
  if (!url || !uid) {
    console.error('✗ Error: URL and element UID are required');
    console.error('Tip: Use "cdp-cli snapshot <url>" to get element UIDs');
    process.exit(1);
  }

  try {
    const client = await getClient();
    console.log(`Navigating to ${url}...`);
    const navResult = await client.callTool('navigate_page', { url });
    const pageId = extractPageId(navResult);
    await client.callTool('wait_for', { duration: 1000 });
    
    console.log(`Clicking element (uid: ${uid})...`);
    const result = await client.callTool('click', { uid });
    
    console.log('✓ Click successful');
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
