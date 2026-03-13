#!/bin/bash

# CDP CLI Test Commands
# Make sure Chrome is running with: 
# /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile-stable

echo "🧪 Testing CDP CLI Commands"
echo "================================"
echo ""

# Test URL
TEST_URL="https://example.com"

# Counters
PASSED=0
FAILED=0

# Helper function to run test
run_test() {
  local test_name="$1"
  local check_pageid="$2"
  shift 2
  local output
  
  echo -n "Testing $test_name... "
  
  # Capture output and exit code
  output=$(eval "$@" 2>&1)
  exit_code=$?
  
  # Check for success
  if [ $exit_code -eq 0 ] && ! echo "$output" | grep -q "invalid_type\|Error:"; then
    # If check_pageid is true, verify Page ID is present
    if [ "$check_pageid" = "true" ]; then
      if echo "$output" | grep -q "Page ID:"; then
        echo "✅ PASS (with Page ID)"
        ((PASSED++))
      else
        echo "❌ FAIL (missing Page ID)"
        ((FAILED++))
      fi
    else
      echo "✅ PASS"
      ((PASSED++))
    fi
  else
    echo "❌ FAIL"
    echo "  Error: $(echo "$output" | grep -E "Error:|invalid_type" | head -1)"
    ((FAILED++))
  fi
  echo ""
}

echo "Starting tests..."
echo ""

# Navigation
run_test "navigate" true "cdp-cli navigate $TEST_URL"

# Persistent session tests (navigate once, then test without URL)
echo "Testing persistent session workflow..."
cdp-cli navigate $TEST_URL > /dev/null 2>&1

run_test "screenshot (current page)" false "cdp-cli screenshot test-screenshot.png"
run_test "snapshot (current page)" false "cdp-cli snapshot"
run_test "console (current page)" false "cdp-cli console"
run_test "network (current page)" false "cdp-cli network"
run_test "evaluate (current page)" false "cdp-cli evaluate '() => document.title'"

# Tests with URL (navigate each time)
run_test "screenshot (with URL)" true "cdp-cli screenshot test-screenshot2.png $TEST_URL"
run_test "snapshot (with URL)" true "cdp-cli snapshot $TEST_URL"
run_test "console (with URL)" false "cdp-cli console https://developers.chrome.com"
run_test "evaluate (with URL)" true "cdp-cli evaluate '() => document.title' $TEST_URL"
run_test "network (with URL)" false "cdp-cli network $TEST_URL"

# Device emulation
run_test "emulate device" false "cdp-cli emulate $TEST_URL 'iPhone 12'"

# Page management
run_test "list pages" false "cdp-cli pages"
run_test "list pages (alias)" false "cdp-cli list-pages"
run_test "new page" false "cdp-cli new-page https://github.com"

# Test page ID extraction and page management
echo "Testing page ID functionality..."
PAGE_OUTPUT=$(cdp-cli navigate $TEST_URL 2>&1)
if echo "$PAGE_OUTPUT" | grep -q "Page ID: [0-9]"; then
  PAGE_ID=$(echo "$PAGE_OUTPUT" | grep -o "Page ID: [0-9]*" | grep -o "[0-9]*")
  echo "✅ Page ID extracted: $PAGE_ID"
  
  # Test select-page with extracted ID
  run_test "select page $PAGE_ID" false "cdp-cli select-page $PAGE_ID"
  
  # Create a second page to test close
  cdp-cli new-page https://github.com > /dev/null 2>&1
  PAGES_OUTPUT=$(cdp-cli pages 2>&1)
  SECOND_PAGE_ID=$(echo "$PAGES_OUTPUT" | grep -o "^[0-9]*:" | tail -1 | grep -o "[0-9]*")
  
  if [ -n "$SECOND_PAGE_ID" ]; then
    echo "✅ Second page created: $SECOND_PAGE_ID"
    run_test "close page $SECOND_PAGE_ID" false "cdp-cli close-page $SECOND_PAGE_ID"
  fi
else
  echo "❌ Failed to extract Page ID"
  ((FAILED++))
fi
echo ""

# Performance tests (require URL)
run_test "performance analysis" false "cdp-cli performance https://developers.chrome.com"

echo "⏭️  Skipping interaction tests (click, hover, fill) - require element UIDs from snapshot"
echo "   Run 'cdp-cli snapshot <url>' first to get UIDs, then test manually"
echo ""

echo "⏭️  Skipping lighthouse audit - takes 30-60 seconds"
echo "   Run manually: cdp-cli lighthouse $TEST_URL"
echo ""

# Cleanup
rm -f test-screenshot.png test-screenshot2.png 2>/dev/null

echo "================================"
echo "📊 Test Results"
echo "================================"
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"
echo "📈 Total:  $((PASSED + FAILED))"
echo ""

echo "📋 Commands that return Page ID:"
echo "  - navigate <url>"
echo "  - screenshot <output> <url>"
echo "  - snapshot <url>"
echo "  - evaluate <function> <url>"
echo "  - lighthouse <url>"
echo "  - click <url> <uid>"
echo "  - hover <url> <uid>"
echo "  - fill <url> <uid> <value>"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "🎉 All tests passed!"
  exit 0
else
  echo "⚠️  Some tests failed. Check errors above."
  exit 1
fi
