# Use the custom base image
FROM imbios/bun-node:latest

# Set working directory
WORKDIR /app

COPY package.json .

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to start the application
CMD ["bun", "start"]
