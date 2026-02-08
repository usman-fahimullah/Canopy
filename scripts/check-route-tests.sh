#!/usr/bin/env bash
#
# check-route-tests.sh
#
# Finds API route files (route.ts) that have no corresponding test file.
# Uses fuzzy matching: a test file matches if its name is a substring of
# the route's derived name, or vice versa.
#
# Exits with code 0 (warnings only) — does not block push.

set -euo pipefail

ROUTES_DIR="src/app/api"
TESTS_DIR="src/app/api/__tests__"

# Collect all test base names (without .test.ts extension)
declare -a test_names=()
if [ -d "$TESTS_DIR" ]; then
  for test_file in "$TESTS_DIR"/*.test.ts "$TESTS_DIR"/*.test.tsx; do
    [ -e "$test_file" ] || continue
    base=$(basename "$test_file" | sed 's/\.test\.\(ts\|tsx\)$//')
    test_names+=("$base")
  done
fi

# Collect all route files
route_files=$(find "$ROUTES_DIR" -name "route.ts" -not -path "*/__tests__/*" | sort)

untested=()
tested=0
total=0

for route in $route_files; do
  total=$((total + 1))

  # Derive a name from the route path
  # e.g. src/app/api/canopy/roles/[id]/email-automation/route.ts
  #   → canopy-roles-email-automation
  relative="${route#$ROUTES_DIR/}"
  relative="${relative%/route.ts}"
  # Remove [param] segments, replace / with -, collapse dashes
  route_name=$(echo "$relative" | sed 's/\[[^]]*\]//g; s|/|-|g; s/--*/-/g; s/^-//; s/-$//')

  [ -z "$route_name" ] && continue

  # Check if any existing test matches (substring match in either direction)
  found=false
  for tn in "${test_names[@]}"; do
    # Exact match
    if [ "$tn" = "$route_name" ]; then
      found=true
      break
    fi
    # Test name is a prefix/substring of route name (e.g. "coaches" matches "coaches")
    if [[ "$route_name" == *"$tn"* ]]; then
      found=true
      break
    fi
    # Route name is a prefix/substring of test name
    if [[ "$tn" == *"$route_name"* ]]; then
      found=true
      break
    fi
  done

  if [ "$found" = true ]; then
    tested=$((tested + 1))
  else
    untested+=("$route")
  fi
done

echo ""
echo "📊 API Route Test Coverage: $tested/$total routes have tests"
echo ""

if [ ${#untested[@]} -gt 0 ]; then
  echo "⚠️  Routes without test coverage (${#untested[@]}):"
  for u in "${untested[@]}"; do
    echo "   • $u"
  done
  echo ""
  echo "💡 Add test files to $TESTS_DIR/ to improve coverage."
else
  echo "✅ All API routes have test files!"
fi

echo ""
