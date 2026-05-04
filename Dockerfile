# Use Node.js as the base image
FROM node:18-slim

# Install Python and other dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package files and install Node dependencies
COPY package*.json ./
RUN npm install

# Copy requirements and install Python dependencies
COPY requirements.txt ./
RUN python3 -m pip install --no-cache-dir --break-system-packages -r requirements.txt

# Copy the rest of the application
COPY . .

# Generate Prisma client and build Next.js
RUN npx prisma generate
RUN npm run build

# Expose the port (Railway uses PORT env var)
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
