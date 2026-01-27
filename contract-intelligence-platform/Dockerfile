# --- Etapa 1: Construcción (Build) ---
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos los archivos de definición de paquetes
COPY package.json ./
# Si tienes un package-lock.json, es recomendable descomentar la siguiente línea:
COPY package-lock.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Argumentos de construcción:
# Vite necesita la API Key en tiempo de construcción para "quemarla" en el código JS.
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY

# Ejecutamos el build de Vite (genera la carpeta /dist)
RUN npm run build

# --- Etapa 2: Servidor de Producción (Nginx) ---
FROM nginx:alpine

# Copiamos los archivos estáticos generados en la etapa anterior a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración personalizada de Nginx para Single Page Applications (SPA)
# Esto redirige todas las rutas a index.html para que React Router funcione al recargar la página.
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]