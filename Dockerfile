# 1️⃣ Use a multi-stage build for efficiency
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy only package files first to leverage Docker caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# 2️⃣ Build the Next.js Vite project
RUN npm run build && \
    npm prune --production  # Remove dev dependencies to reduce image size

# 3️⃣ Create a lightweight final image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules

# Set runtime environment variables (optional)
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the Next.js Vite server
CMD ["npm", "run", "start"]
