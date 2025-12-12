# Stage 1: Build App
FROM node:18-alpine AS build

# Install bash & necessary permissions (fixes "vite: permission denied")
RUN apk add --no-cache bash

WORKDIR /app

# Copy only package files first to use Docker cache
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Give execute permission to vite if needed
RUN chmod +x node_modules/.bin/vite

# Build the Vite app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.25

# Remove default Nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy all built files from dist to Nginx folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 3001
EXPOSE 3001

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
