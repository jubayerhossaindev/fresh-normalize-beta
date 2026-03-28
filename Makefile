.PHONY: all install build test lint format clean dev docker docker-test help

# Default target
all: install build test

## Install: install all dependencies and Playwright browsers
install:
	npm ci
	npx playwright install --with-deps

## Build: build the minified dist output
build:
	npm run build

## Test: run all tests (lint + unit + browser)
test:
	npm run test:all

## Lint: run StyleLint only
lint:
	npm run lint

## Format: auto-format all files with Prettier
format:
	npm run format

## Dev: start local development server
dev:
	npm run dev

## Size: check bundle sizes against budget
size:
	npm run size

## Clean: remove build artifacts and test results
clean:
	rm -rf dist/ test-results/ playwright-report/ coverage/ _site/ size-results.json

## Docker: build the production Docker image
docker:
	docker build --target production -t fresh-normalize:latest .

## Docker test: run tests inside Docker
docker-test:
	docker compose run --rm test

## Release dry run: preview what `np` would do
release-dry:
	npm run release:dry

## Help: show this help message
help:
	@echo ""
	@echo "fresh-normalize Makefile targets:"
	@echo ""
	@grep -E '^## ' Makefile | sed 's/## /  make /' | sed 's/: /\t\t/'
	@echo ""
