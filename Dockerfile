# Use Node.js 20 (Alpine for a smaller image)
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy only package files first for efficient caching
COPY package.json package-lock.json ./

# Install dependencies (use `ci` for clean install)
RUN npm ci --omit=dev

# Copy the rest of the application files
COPY . .

# Build the Next.js project
RUN npm run build

# Use a smaller runtime image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules

# Set Google Cloud Run's expected PORT
ENV PORT=8080

# Expose the correct port
EXPOSE 8080

# Start the Next.js application
CMD ["npm", "run", "start"]
