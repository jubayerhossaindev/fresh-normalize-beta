#!/bin/bash
#
# CI/CD Local Test Script
# This script simulates GitHub Actions CI locally
# Run: ./scripts/test-ci.sh
#

set -e  # Exit on any error

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         CI/CD Local Test - Simulating GitHub Actions        ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Track overall status
PASSED=0
FAILED=0

run_step() {
    local name="$1"
    local command="$2"

    echo -e "${YELLOW}▶ Running: $name${NC}"
    echo -e "  Command: $command"
    echo ""

    if eval "$command"; then
        echo -e "${GREEN}✅ $name - PASSED${NC}"
        echo ""
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ $name - FAILED${NC}"
        echo ""
        ((FAILED++))
        return 1
    fi
}

# ============================================
# Job 1: Lint & Type Check
# ============================================
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Job 1: Lint & Type Check${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

run_step "ESLint" "npm run lint:eslint"
run_step "Stylelint" "npm run lint:stylelint"
run_step "TypeScript" "npm run typecheck"
run_step "Prettier Format Check" "npm run format:check"

# ============================================
# Job 2: Unit Tests (with coverage)
# ============================================
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Job 2: Unit Tests (Vitest)${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

export CI=true
run_step "Unit Tests with Coverage" "npm run test:unit:ci"

# Check coverage threshold
echo -e "${YELLOW}▶ Checking coverage threshold (100%)${NC}"
if grep -q '"lines": 100' coverage/coverage-summary.json && \
   grep -q '"functions": 100' coverage/coverage-summary.json && \
   grep -q '"branches": 100' coverage/coverage-summary.json && \
   grep -q '"statements": 100' coverage/coverage-summary.json; then
    echo -e "${GREEN}✅ Coverage threshold met - 100% coverage${NC}"
else
    echo -e "${RED}❌ Coverage threshold not met${NC}"
    ((FAILED++))
fi
echo ""

# ============================================
# Job 3: E2E Tests (Playwright)
# ============================================
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Job 3: E2E Tests (Playwright)${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

run_step "E2E Tests (Chromium)" "npm run test:e2e:chromium"

# ============================================
# Job 4: Build
# ============================================
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Job 4: Build${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

run_step "Build Minified CSS" "npm run build"

# Verify build output
echo -e "${YELLOW}▶ Verifying build artifacts${NC}"
if [ -f "dist/fresh-normalize.min.css" ]; then
    SIZE=$(stat -c%s "dist/fresh-normalize.min.css")
    echo -e "${GREEN}✅ dist/fresh-normalize.min.css created (${SIZE} bytes)${NC}"
else
    echo -e "${RED}❌ dist/fresh-normalize.min.css not found${NC}"
    ((FAILED++))
fi
echo ""

# ============================================
# Summary
# ============================================
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    FINAL SUMMARY                             ║${NC}"
echo -e "${BLUE}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║ ✅ Passed: $PASSED                                              ${NC}"
echo -e "${RED}║ ❌ Failed: $FAILED                                              ${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All CI checks passed! Ready to push to GitHub.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some CI checks failed. Fix them before pushing.${NC}"
    exit 1
fi
