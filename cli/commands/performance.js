import { getClient, closeClient } from '../lib/shared-client.js';

export async function performance(url) {
  if (!url) {
    console.error('✗ Error: URL is required');
    process.exit(1);
  }

  try {
    const client = await getClient();
    console.log(`Analyzing performance of ${url}...`);
    
    await client.callTool('performance_start_trace', {});
    await client.callTool('navigate_page', { url });
    await client.callTool('wait_for', { duration: 3000 });
    await client.callTool('performance_stop_trace', {});
    
    const result = await client.callTool('performance_analyze_insight', {});
    
    console.log('✓ Performance analysis complete:');
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
