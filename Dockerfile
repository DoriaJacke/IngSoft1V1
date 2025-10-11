# Usar imagen base que incluya tanto Python como Node.js
FROM python:3.11-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema y Node.js
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Verificar instalaciones
RUN python --version && node --version && npm --version

# Copiar y instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar y instalar dependencias de Node.js
COPY package*.json ./
RUN npm install

# Copiar todo el código de la aplicación
COPY . .

# Crear directorio instance si no existe
RUN mkdir -p instance

# Construir la aplicación React para producción
RUN npm run build

# Copiar script de inicio y darle permisos
COPY start-services.sh /app/
RUN chmod +x /app/start-services.sh

# Instalar curl para health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Exponer puertos para ambos servicios
EXPOSE 5001 3000

# Variables de entorno
ENV FLASK_APP=app_reportes.py
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1
ENV NODE_ENV=production

# Comando para iniciar ambos servicios
CMD ["./start-services.sh"]