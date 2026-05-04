# Use Node.js 22 as the base image
FROM node:22-slim

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

# Generate Prisma client and build Next.js (skip db push during build)
RUN npx prisma generate
RUN NEXT_TELEMETRY_DISABLED=1 npx next build

# Expose the port (Railway uses PORT env var)
EXPOSE 8080

# Start the application - run migrations/db push at runtime
CMD npx prisma db push --accept-data-loss && npm start
