import { getClient, closeClient } from '../lib/shared-client.js';
import { extractPageId } from '../lib/parse-response.js';

export async function fill(url, uid, value) {
  if (!url || !uid || value === undefined) {
    console.error('✗ Error: URL, element UID, and value are required');
    console.error('Tip: Use "cdp-cli snapshot <url>" to get element UIDs');
    process.exit(1);
  }

  try {
    const client = await getClient();
    console.log(`Navigating to ${url}...`);
    const navResult = await client.callTool('navigate_page', { url });
    const pageId = extractPageId(navResult);
    await client.callTool('wait_for', { duration: 1000 });
    
    console.log(`Filling element (uid: ${uid}) with: ${value}...`);
    const result = await client.callTool('fill', { uid, value });
    
    console.log('✓ Fill successful');
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
