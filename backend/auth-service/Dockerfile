FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src/ ./src/

# Expose port
EXPOSE 5001

# Start the service - FIXED PATH
CMD ["npm", "start"]
