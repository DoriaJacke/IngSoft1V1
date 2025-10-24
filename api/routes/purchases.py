from flask import Blueprint, request, jsonify
from datetime import datetime
from api.models import db, Purchase, User, Event, Ticket, EmailLog
import uuid

purchases_bp = Blueprint('purchases', __name__)

@purchases_bp.route('/purchases', methods=['POST'])
def create_purchase():
    """Crear una nueva compra de entradas"""
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['userId', 'eventId', 'quantity', 'unitPrice', 'totalPrice']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo requerido: {field}'}), 400
        
        # Verificar que el usuario existe
        user = User.query.get(data['userId'])
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        # Verificar que el evento existe
        event = Event.query.get(data['eventId'])
        if not event:
            return jsonify({'error': 'Evento no encontrado'}), 404
        
        # Verificar disponibilidad de entradas
        if event.available_tickets < data['quantity']:
            return jsonify({'error': 'No hay suficientes entradas disponibles'}), 400
        
        # Generar número de orden único
        order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"
        
        # Crear la compra
        purchase = Purchase(
            order_number=order_number,
            user_id=data['userId'],
            event_id=data['eventId'],
            quantity=data['quantity'],
            unit_price=data['unitPrice'],
            service_charge=data.get('serviceCharge', 0),
            total_price=data['totalPrice'],
            status='pending',
            qr_code_data=f"ORD:{order_number}:USER:{user.email}:QTY:{data['quantity']}"
        )
        
        db.session.add(purchase)
        db.session.flush()  # Para obtener el ID de la compra
        
        # Crear tickets individuales
        tickets = []
        for i in range(data['quantity']):
            ticket_number = f"{order_number}-T{i+1:03d}"
            qr_data = f"TICKET:{ticket_number}:EVENT:{event.id}:USER:{user.email}"
            
            ticket = Ticket(
                purchase_id=purchase.id,
                ticket_number=ticket_number,
                qr_code_data=qr_data
            )
            tickets.append(ticket)
            db.session.add(ticket)
        
        # Actualizar entradas disponibles
        event.available_tickets -= data['quantity']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Compra creada exitosamente',
            'purchase': purchase.to_dict(),
            'tickets': [ticket.to_dict() for ticket in tickets]
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error interno del servidor: {str(e)}'}), 500

@purchases_bp.route('/purchases/<int:purchase_id>', methods=['GET'])
def get_purchase(purchase_id):
    """Obtener una compra específica"""
    try:
        purchase = Purchase.query.get(purchase_id)
        if not purchase:
            return jsonify({'error': 'Compra no encontrada'}), 404
        
        return jsonify({
            'success': True,
            'purchase': purchase.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': f'Error interno del servidor: {str(e)}'}), 500

@purchases_bp.route('/purchases/order/<string:order_number>', methods=['GET'])
def get_purchase_by_order(order_number):
    """Obtener una compra por número de orden"""
    try:
        purchase = Purchase.query.filter_by(order_number=order_number).first()
        if not purchase:
            return jsonify({'error': 'Compra no encontrada'}), 404
        
        return jsonify({
            'success': True,
            'purchase': purchase.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': f'Error interno del servidor: {str(e)}'}), 500

@purchases_bp.route('/purchases/user/<int:user_id>', methods=['GET'])
def get_user_purchases(user_id):
    """Obtener todas las compras de un usuario"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        purchases = Purchase.query.filter_by(user_id=user_id).order_by(Purchase.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'purchases': [purchase.to_dict() for purchase in purchases]
        })
        
    except Exception as e:
        return jsonify({'error': f'Error interno del servidor: {str(e)}'}), 500

@purchases_bp.route('/purchases/<int:purchase_id>/status', methods=['PUT'])
def update_purchase_status(purchase_id):
    """Actualizar el estado de una compra"""
    try:
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'error': 'Campo requerido: status'}), 400
        
        valid_statuses = ['pending', 'completed', 'cancelled', 'refunded']
        if data['status'] not in valid_statuses:
            return jsonify({'error': f'Estado inválido. Valores permitidos: {valid_statuses}'}), 400
        
        purchase = Purchase.query.get(purchase_id)
        if not purchase:
            return jsonify({'error': 'Compra no encontrada'}), 404
        
        old_status = purchase.status
        purchase.status = data['status']
        purchase.updated_at = datetime.utcnow()
        
        # Si se cancela la compra, devolver las entradas disponibles
        if data['status'] == 'cancelled' and old_status != 'cancelled':
            event = Event.query.get(purchase.event_id)
            if event:
                event.available_tickets += purchase.quantity
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Estado actualizado de {old_status} a {data["status"]}',
            'purchase': purchase.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error interno del servidor: {str(e)}'}), 500

@purchases_bp.route('/purchases/<int:purchase_id>/email-status', methods=['PUT'])
def update_email_status(purchase_id):
    """Actualizar el estado del email de confirmación"""
    try:
        data = request.get_json()
        
        purchase = Purchase.query.get(purchase_id)
        if not purchase:
            return jsonify({'error': 'Compra no encontrada'}), 404
        
        purchase.email_sent = data.get('emailSent', True)
        if purchase.email_sent:
            purchase.email_sent_at = datetime.utcnow()
        
        # Registrar en log de emails
        email_log = EmailLog(
            purchase_id=purchase.id,
            email_type='confirmation',
            recipient_email=purchase.user.email,
            subject=data.get('subject', 'Confirmación de compra'),
            status='sent' if purchase.email_sent else 'failed',
            sendgrid_message_id=data.get('messageId'),
            error_message=data.get('errorMessage')
        )
        
        db.session.add(email_log)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Estado de email actualizado',
            'purchase': purchase.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error interno del servidor: {str(e)}'}), 500

@purchases_bp.route('/purchases', methods=['GET'])
def list_purchases():
    """Listar todas las compras con filtros opcionales"""
    try:
        # Parámetros de consulta
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 50, type=int), 100)
        status = request.args.get('status')
        event_id = request.args.get('event_id')
        user_id = request.args.get('user_id')
        
        # Construir consulta
        query = Purchase.query
        
        if status:
            query = query.filter(Purchase.status == status)
        if event_id:
            query = query.filter(Purchase.event_id == event_id)
        if user_id:
            query = query.filter(Purchase.user_id == user_id)
        
        # Paginar resultados
        purchases = query.order_by(Purchase.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'purchases': [purchase.to_dict() for purchase in purchases.items],
            'pagination': {
                'page': page,
                'pages': purchases.pages,
                'per_page': per_page,
                'total': purchases.total,
                'has_next': purchases.has_next,
                'has_prev': purchases.has_prev
            }
        })
        
    except Exception as e:
        return jsonify({'error': f'Error interno del servidor: {str(e)}'}), 500