# Use lightweight Node.js 18 base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy application code
COPY . .

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose internal port
EXPOSE 3000

# Start web application
CMD ["node", "index.js"]
