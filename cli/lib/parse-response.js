// Helper to safely extract page number (pageId) from MCP tool response
// The chrome-devtools-mcp server uses page numbers (1, 2, 3...) as page IDs
export function extractPageId(result) {
  if (!result?.content?.[0]?.text) {
    return null;
  }

  const text = result.content[0].text;
  
  // Try parsing as JSON first (in case format changes)
  try {
    const parsed = JSON.parse(text);
    if (parsed.pageId) {
      return parseInt(parsed.pageId, 10);
    }
  } catch (e) {
    // Not JSON, continue with text parsing
  }
  
  // Extract page number from text like "1: https://example.com/ [selected]"
  // The format is: "## Pages\n1: url [selected]" or just "1: url"
  const match = text.match(/^(\d+):\s+https?:\/\//m);
  if (match) {
    return parseInt(match[1], 10);
  }
  
  // Try to extract from "Pages" section
  const pagesMatch = text.match(/##\s*Pages\s*\n(\d+):/);
  if (pagesMatch) {
    return parseInt(pagesMatch[1], 10);
  }
  
  return null;
}
