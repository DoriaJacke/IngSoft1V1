# 🚀 COMANDOS RÁPIDOS PARA EJECUTAR EL CONTENEDOR

## Para cualquier persona que quiera ejecutar tu aplicación:

### 📥 1. Descargar el código
```bash
git clone https://github.com/DoriaJacke/IngSoft1V1.git
cd IngSoft1V1
git checkout MFLP-17-Dashboard
```

### 🐳 2. Ejecutar con Docker (Comando único)
```bash
docker build -t eventos-vina-dashboard . && docker run -d --name eventos_vina_dashboard -p 5001:5001 -p 3000:3000 eventos-vina-dashboard
```

### 🌐 3. Abrir en navegador
- **Frontend**: http://localhost:3000
- **API Swagger**: http://localhost:5001/docs

---

## 🔧 Scripts Automáticos Incluidos

### Windows (Doble clic)
```
ejecutar-docker.bat
```

### Linux/Mac
```bash
./ejecutar-docker.sh
```

---

## ⚡ Comandos de Un Solo Paso

### Windows PowerShell
```powershell
git clone https://github.com/DoriaJacke/IngSoft1V1.git; cd IngSoft1V1; git checkout MFLP-17-Dashboard; docker build -t eventos-vina-dashboard .; docker run -d --name eventos_vina_dashboard -p 5001:5001 -p 3000:3000 eventos-vina-dashboard
```

### Linux/Mac
```bash
git clone https://github.com/DoriaJacke/IngSoft1V1.git && cd IngSoft1V1 && git checkout MFLP-17-Dashboard && docker build -t eventos-vina-dashboard . && docker run -d --name eventos_vina_dashboard -p 5001:5001 -p 3000:3000 eventos-vina-dashboard
```

---

## 🎯 Verificación Rápida
```bash
docker logs eventos_vina_dashboard
curl http://localhost:5001/eventos/logs
curl http://localhost:3000
```

**¡Listo en 3 comandos!** 🎊