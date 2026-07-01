FROM node:22-alpine

WORKDIR /app

# Install dependencies (including dev for build tools)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build frontend with Vite (output goes to dist/public, separate from server.cjs)
RUN npx vite build

# Compile server with esbuild; fail the build if this fails
RUN npx esbuild server.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist/server.cjs

# Slim image by removing dev dependencies
RUN npm prune --production

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
