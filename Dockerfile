# ============================================================
# fresh-normalize — Development & Test Container
# ============================================================
# Stage 1: Base with Node.js LTS
FROM node:22-slim AS base

LABEL org.opencontainers.image.title="fresh-normalize"
LABEL org.opencontainers.image.description="Dev environment for fresh-normalize CSS library"
LABEL org.opencontainers.image.source="https://github.com/YOUR_USERNAME/fresh-normalize"
LABEL org.opencontainers.image.licenses="MIT"

WORKDIR /app

# Install system dependencies for Playwright
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# ============================================================
# Stage 2: Dependencies
FROM base AS deps

COPY package*.json ./

# Install all dependencies (including devDeps for testing)
RUN npm ci --include=dev

# ============================================================
# Stage 3: Development (with hot reload + browser testing)
FROM deps AS development

# Install Playwright system dependencies and browsers
RUN npx playwright install --with-deps chromium firefox webkit

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]

# ============================================================
# Stage 4: Test runner
FROM deps AS test

# Install Playwright browsers for CI
RUN npx playwright install --with-deps

COPY . .

# Run linting, unit tests, and browser tests
CMD ["npm", "run", "test:all"]

# ============================================================
# Stage 5: Build (just outputs dist/)
FROM deps AS builder

COPY . .

RUN npm run build

# ============================================================
# Stage 6: Production (minimal — just the CSS files served)
FROM nginx:1.27-alpine AS production

LABEL org.opencontainers.image.title="fresh-normalize (prod)"

# Copy built CSS files
COPY --from=builder /app/fresh-normalize.css /usr/share/nginx/html/
COPY --from=builder /app/dist/ /usr/share/nginx/html/dist/
COPY --from=builder /app/test/page/ /usr/share/nginx/html/

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost/fresh-normalize.css | head -1 | grep -q "fresh-normalize" || exit 1
