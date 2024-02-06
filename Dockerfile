# Use the official Node.js image as base
FROM node:latest AS builder

# Set working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Run npm install to install dependencies with progress output
RUN npm install

# Build the application
RUN npm run build

# Use the official Nginx image as base
FROM nginx:latest

# Copy built files from the builder stage to Nginx's default public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
