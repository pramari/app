# Multi-stage Dockerfile for SvelteKit with @sveltejs/adapter-node
# - Build stage installs devDependencies and runs the SvelteKit build
# - Production stage installs only production deps and runs the Node server
# Target: Google Cloud Run (listens on $PORT, default 8080)

########################################
# Build stage
########################################
FROM node:20-bullseye-slim AS build

# Create app directory
WORKDIR /app

# Copy package manifests first to leverage Docker layer caching
COPY package.json package-lock.json* ./

# Install dependencies (including dev deps needed to build)
RUN npm ci

# Copy the rest of the app source
COPY . .

# Run the SvelteKit build (adapter-node should emit a runnable build/ directory)
RUN npm run build

########################################
# Production stage
########################################
FROM node:20-bullseye-slim AS production

WORKDIR /app

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Copy only package manifests to install production deps
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --omit=dev --production

# Copy build output from build stage
COPY --from=build /app/build ./build

# (Optional) copy static assets if you use a separate static dir:
# COPY --from=build /app/static ./static

# Expose the port Cloud Run will route to
EXPOSE 8080

# Start the Node server produced by @sveltejs/adapter-node
# The adapter output should be runnable via `node build`
CMD ["node", "build"]
