# Use a Node.js LTS version
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the SvelteKit app
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Set the command to start the app
# The HOST and PORT environment variables are used by SvelteKit's adapter-node
ENV HOST=0.0.0.0
ENV PORT=8080
CMD [ "node", "build" ]
