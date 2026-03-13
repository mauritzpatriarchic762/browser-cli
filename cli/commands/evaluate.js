import { getClient, closeClient } from '../lib/shared-client.js';
import { extractPageId } from '../lib/parse-response.js';

export async function evaluate(urlOrFunction, jsFunction) {
  // If only one argument, treat it as function for current page
  // If two arguments, first is URL, second is function
  let url, func;
  
  if (!jsFunction) {
    // Only one argument - it's the function
    func = urlOrFunction;
    url = null;
  } else {
    // Two arguments - url and function
    url = urlOrFunction;
    func = jsFunction;
  }
  
  if (!func) {
    console.error('✗ Error: JavaScript function is required');
    console.error('Example: cdp-cli evaluate "() => document.title"');
    console.error('Or: cdp-cli evaluate https://example.com "() => document.title"');
    process.exit(1);
  }

  try {
    const client = await getClient();
    let pageId;
    
    if (url) {
      console.log(`Navigating to ${url}...`);
      const navResult = await client.callTool('navigate_page', { url });
      pageId = extractPageId(navResult);
      await client.callTool('wait_for', { duration: 1000 });
    } else {
      console.log('Evaluating function on current page...');
    }
    
    console.log(`Evaluating function...`);
    const result = await client.callTool('evaluate_script', { function: func });
    
    console.log('✓ Function executed:');
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
