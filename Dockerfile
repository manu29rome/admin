# Etapa 1: Build con Node 20
FROM node:20-alpine AS build
WORKDIR /app

# Copiar y instalar dependencias
COPY package*.json ./
RUN npm install --force

# Copiar el proyecto
COPY . .

# Construir Angular
RUN npm run build 

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /dist/frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
