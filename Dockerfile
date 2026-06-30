FROM node:22-alpine

WORKDIR /app

# Install dependencies (including dev for build tools)
COPY package*.json ./
RUN npm install

# Copy source (includes pre-compiled dist/server.cjs from git as fallback)
COPY . .

# Build frontend with Vite (required)
RUN npx vite build

# (Re)compile server with esbuild; if it fails, the pre-committed server.cjs is used
RUN npx esbuild server.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist/server.cjs || echo "[Dockerfile] esbuild skipped — using pre-committed dist/server.cjs"

# Slim image by removing dev dependencies
RUN npm prune --production

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
