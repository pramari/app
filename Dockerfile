# Multi-stage Dockerfile for SvelteKit with @sveltejs/adapter-node
# - Build stage installs devDependencies and runs the SvelteKit build
# - Production stage installs only production deps and runs the Node server
# Target: Google Cloud Run (listens on $PORT, default 8080)

########################################
# Build stage
########################################
FROM node:22-bullseye-slim AS build

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

# Remove devDependencies after build so the node_modules can be copied to the production image.
# This prunes out dev-only packages but keeps production dependencies required at runtime.
RUN npm prune --production

########################################
# Production stage
########################################
FROM node:22-bullseye-slim AS production

WORKDIR /app

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Copy only package manifests (kept for metadata) and copy pruned production node_modules from the build stage.
# We avoid running npm in the production stage to make the image smaller and deterministic.
COPY package.json package-lock.json* ./

# Copy production node_modules prepared in the build stage
COPY --from=build /app/node_modules ./node_modules

# Copy build output from build stage
COPY --from=build /app/build ./build

# (Optional) copy static assets if you use a separate static dir:
# COPY --from=build /app/static ./static

# Expose the port Cloud Run will route to
EXPOSE 8080

# Start the Node server produced by @sveltejs/adapter-node
# The adapter output should be runnable via `node build`
CMD ["node", "build"]
