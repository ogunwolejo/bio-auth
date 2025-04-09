# Stage 1: Build the application
FROM node:22 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create a smaller runtime image
FROM node:22 AS runtime

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Install only production dependencies
RUN npm install --production

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main.js"]
