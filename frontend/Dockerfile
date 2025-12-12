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

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
