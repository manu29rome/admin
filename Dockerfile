# Etapa 1: Build
FROM node:20.22-alpine AS build  
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build --configuration production

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080