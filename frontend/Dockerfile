# Stage 1: Build App
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.25

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3001
CMD ["nginx", "-g", "daemon off;"]
