import { getClient, closeClient } from '../lib/shared-client.js';
import { extractPageId } from '../lib/parse-response.js';

export async function lighthouse(url) {
  if (!url) {
    console.error('✗ Error: URL is required');
    process.exit(1);
  }

  try {
    const client = await getClient();
    console.log(`Running Lighthouse audit on ${url}...`);
    console.log('(This may take a minute...)');
    
    const navResult = await client.callTool('navigate_page', { url });
    const pageId = extractPageId(navResult);
    
    const result = await client.callTool('lighthouse_audit', {});
    
    console.log('✓ Lighthouse audit complete:');
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
