# Etapa 1: Build
FROM node:20-alpine3.19 AS builder

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache wget tar

WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Compilar la aplicación
RUN npm run build


# Etapa 2: Producción
FROM node:20-alpine3.19 AS production

# Instalar dockerize para esperar la DB
RUN apk add --no-cache wget tar && \
    wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz && \
    tar -xzvf dockerize-linux-amd64-v0.6.1.tar.gz && \
    mv dockerize /usr/local/bin/dockerize

WORKDIR /usr/src/app

# Copiar solo lo necesario desde la etapa de build
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

EXPOSE 8080

# Esperar a MySQL y luego iniciar la app
CMD ["dockerize", "-wait", "tcp://mysql:3306", "-timeout", "60s", "--", "npm", "run", "start:prod"]
