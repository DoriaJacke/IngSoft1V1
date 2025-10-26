#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para ejecutar la API Flask de eventos
"""
import os
import sys

# Agregar el directorio del proyecto al Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Configurar variables de entorno
os.environ['PYTHONPATH'] = current_dir

from api.app import create_app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('FLASK_PORT', 5001))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"Flask API con SQLAlchemy iniciando en puerto {port}")
    print(f"Base de datos: {app.config['SQLALCHEMY_DATABASE_URI']}")
    print(f"Debug mode: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)