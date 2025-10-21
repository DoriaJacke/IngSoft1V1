import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def create_app():
    """Factory function para crear la aplicación Flask"""
    app = Flask(__name__)
    
    # Configuración de la base de datos
    database_url = os.getenv('DATABASE_URL', 'sqlite:///entradas.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Configuración de CORS
    CORS(app, origins=['http://localhost:3000', 'http://localhost:5173'])
    
    # Inicializar extensiones
    from api.models import db
    db.init_app(app)
    
    # Registrar blueprints
    from api.routes.users import users_bp
    from api.routes.events import events_bp
    from api.routes.purchases import purchases_bp
    from api.routes.tickets import tickets_bp
    
    app.register_blueprint(users_bp, url_prefix='/api')
    app.register_blueprint(events_bp, url_prefix='/api')
    app.register_blueprint(purchases_bp, url_prefix='/api')
    app.register_blueprint(tickets_bp, url_prefix='/api')
    
    # Crear tablas si no existen
    with app.app_context():
        db.create_all()
        
        # Poblar con datos iniciales si la base está vacía
        from api.utils.seed_data import seed_initial_data
        seed_initial_data()
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"🚀 Flask API con SQLAlchemy iniciando en puerto {port}")
    print(f"📊 Base de datos: {app.config['SQLALCHEMY_DATABASE_URI']}")
    print(f"🔧 Debug mode: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)