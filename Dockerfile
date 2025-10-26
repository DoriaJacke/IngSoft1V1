# Usar imagen base con Python y Node.js
FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema, Node.js y herramientas de compilación
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de configuración
COPY package*.json ./
COPY requirements.txt ./

# Instalar dependencias de Node.js
RUN npm install

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Instalar serve globalmente para servir el frontend
RUN npm install -g serve

# Copiar código fuente
COPY src ./src
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY .env.production ./
COPY .env ./
COPY api ./api
COPY server ./server
COPY app_reportes.py ./

# Construir el frontend
RUN npm run build

# Copiar script de inicio
COPY start-services.sh ./
COPY serve.json ./
RUN chmod +x start-services.sh

# Crear directorio instance
RUN mkdir -p instance

# Exponer puertos
EXPOSE 5001 3000

# Variables de entorno
ENV FLASK_APP=api.app
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1
ENV NODE_ENV=production

# Iniciar servicios
CMD ["./start-services.sh"]
