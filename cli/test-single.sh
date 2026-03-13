#!/bin/bash

# Single command test with detailed output
# Usage: ./test-single.sh <command> [args...]

if [ $# -eq 0 ]; then
  echo "Usage: ./test-single.sh <command> [args...]"
  echo ""
  echo "Examples:"
  echo "  ./test-single.sh navigate https://example.com"
  echo "  ./test-single.sh screenshot https://example.com test.png"
  echo "  ./test-single.sh evaluate https://example.com 'document.title'"
  exit 1
fi

echo "🧪 Testing: cdp-cli $@"
echo "================================"
echo ""

# Run command and capture output
output=$(cdp-cli "$@" 2>&1)
exit_code=$?

# Show full output
echo "$output"
echo ""
echo "================================"

# Check result
if [ $exit_code -eq 0 ] && ! echo "$output" | grep -q "invalid_type\|✗ Error:"; then
  echo "✅ PASS - Command executed successfully"
  exit 0
else
  echo "❌ FAIL - Command failed"
  
  # Show specific error if found
  if echo "$output" | grep -q "invalid_type"; then
    echo ""
    echo "Error details:"
    echo "$output" | grep -A 5 "invalid_type"
  fi
  
  exit 1
fi
