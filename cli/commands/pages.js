import { getClient, closeClient } from '../lib/shared-client.js';

export async function listPages() {
  try {
    const client = await getClient();
    console.log('Listing open pages...');
    const result = await client.callTool('list_pages', {});
    
    console.log('✓ Open pages:');
    if (result?.content?.[0]?.text) {
      console.log(result.content[0].text);
    } else {
      console.log('No pages found');
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await closeClient();
  }
}

export async function newPage(url) {
  if (!url) {
    console.error('✗ Error: URL is required');
    process.exit(1);
  }

  try {
    const client = await getClient();
    console.log('Creating new page...');
    const result = await client.callTool('new_page', { url });
    
    console.log('✓ New page created');
    if (result?.content?.[0]?.text) {
      console.log(result.content[0].text);
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await closeClient();
  }
}

export async function selectPage(pageId) {
  if (!pageId) {
    console.error('✗ Error: Page ID is required');
    process.exit(1);
  }

  try {
    const client = await getClient();
    const pageIdNum = parseInt(pageId, 10);
    if (isNaN(pageIdNum)) {
      console.error('✗ Error: Page ID must be a number');
      process.exit(1);
    }
    
    console.log(`Selecting page ${pageIdNum}...`);
    const result = await client.callTool('select_page', { pageId: pageIdNum });
    
    console.log('✓ Page selected');
    if (result?.content?.[0]?.text) {
      console.log(result.content[0].text);
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await closeClient();
  }
}

export async function closePage(pageId) {
  if (!pageId) {
    console.error('✗ Error: Page ID is required');
    process.exit(1);
  }

  try {
    const client = await getClient();
    const pageIdNum = parseInt(pageId, 10);
    if (isNaN(pageIdNum)) {
      console.error('✗ Error: Page ID must be a number');
      process.exit(1);
    }
    
    console.log(`Closing page ${pageIdNum}...`);
    const result = await client.callTool('close_page', { pageId: pageIdNum });
    
    console.log('✓ Page closed');
    if (result?.content?.[0]?.text) {
      console.log(result.content[0].text);
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await closeClient();
  }
}
