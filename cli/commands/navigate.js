import { getClient, closeClient } from '../lib/shared-client.js';
import { extractPageId } from '../lib/parse-response.js';

export async function navigate(url) {
  if (!url) {
    console.error('✗ Error: URL is required');
    process.exit(1);
  }

  try {
    const client = await getClient();
    console.log(`Navigating to ${url}...`);
    const result = await client.callTool('navigate_page', { url });
    
    console.log('✓ Navigation complete');
    if (result?.content?.[0]?.text) {
      console.log(result.content[0].text);
    }
    const pageId = extractPageId(result);
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
