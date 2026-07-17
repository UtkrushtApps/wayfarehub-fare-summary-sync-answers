#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "[run.sh] Installing dependencies..."
npm install --no-audit --no-fund

echo "[run.sh] Typechecking..."
if ! npm run typecheck; then
  echo "[run.sh] Typecheck failed — starter scaffold has a configuration or type error."
  exit 1
fi

echo "[run.sh] Running test suite (assertion failures in the unsolved starter are expected)..."
set +e
npm run test
TEST_EXIT=$?
set -e

if [ "$TEST_EXIT" -gt 1 ]; then
  echo "[run.sh] Test runner failed to collect/execute tests (exit $TEST_EXIT)."
  exit "$TEST_EXIT"
fi

echo "[run.sh] Scaffold is runnable. Test runner executed (exit $TEST_EXIT)."
exit 0
