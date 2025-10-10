# Pruebas del Sistema de Email

## Cómo probar el sistema de email

### 1. Configuración previa
1. Asegúrate de haber configurado EmailJS siguiendo `EMAIL_SETUP.md`
2. Verifica que las credenciales estén correctamente configuradas en `src/services/emailService.ts`

### 2. Prueba del flujo completo

1. **Iniciar la aplicación**:
   ```bash
   npm run dev
   ```

2. **Simular una compra**:
   - Ve a la página principal
   - Selecciona un evento
   - Haz clic en "Comprar entradas"
   - Si no tienes usuario, regístrate o inicia sesión
   - En el checkout, selecciona la cantidad de entradas
   - Completa los datos de pago (son simulados)
   - Haz clic en "Pagar ahora"

3. **Verificar el proceso**:
   - El botón debe mostrar "Procesando pago..." con un spinner
   - Debe aparecer la pantalla de confirmación
   - Verifica el estado del email (enviado/pendiente)
   - Revisa tu bandeja de entrada del email configurado

### 3. Estados posibles

#### ✅ Email enviado exitosamente
- Icono de mail verde en confirmación
- Mensaje: "Email de confirmación enviado"
- El email debe llegar a la bandeja de entrada

#### ⚠️ Email pendiente/con error
- Icono de advertencia amarillo
- Mensaje: "Email de confirmación pendiente"
- Nota sobre revisar la carpeta de spam

### 4. Contenido del email

El email debe incluir:
- ✅ Saludo personalizado con nombre del usuario
- ✅ Información completa del evento
- ✅ Número de orden único
- ✅ Resumen de precios
- ✅ Fecha de compra
- ✅ Instrucciones para el evento
- ✅ Información de contacto

### 5. Troubleshooting

#### Email no llega
1. Verifica las credenciales en `emailService.ts`
2. Revisa la consola del navegador para errores
3. Comprueba la configuración del template en EmailJS
4. Verifica que el servicio de email esté activo

#### Error en el proceso
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña Console
3. Busca errores relacionados con EmailJS
4. Verifica la configuración de CORS en EmailJS

#### Formato del email incorrecto
1. Revisa el template en EmailJS
2. Comprueba que las variables coincidan con el código
3. Verifica el HTML del template

### 6. Variables de prueba

Para testing, puedes usar estos datos de ejemplo:

**Usuario de prueba**:
- Nombre: Juan
- Apellido: Pérez  
- Email: tu-email@example.com

**Evento de prueba**: Cualquier evento de la lista

### 7. Límites del plan gratuito

- **EmailJS gratuito**: 200 emails/mes
- **Tamaño máximo**: 50KB por email
- **Rate limiting**: Aplica para envíos masivos

### 8. Logs y debugging

El sistema registra información en la consola:
- ✅ `Email de confirmación enviado exitosamente`
- ❌ `Error al enviar email de confirmación: [detalle]`

### 9. Pruebas recomendadas

1. **Prueba básica**: Un email con 1 entrada
2. **Prueba múltiple**: Email con varias entradas  
3. **Prueba de errores**: Con credenciales incorrectas
4. **Prueba de red**: Sin conexión a internet
5. **Prueba de caracteres especiales**: Con nombres/eventos con tildes

### 10. Siguientes pasos

Una vez que funcione correctamente:
- [ ] Configurar templates para recordatorios
- [ ] Implementar códigos QR
- [ ] Añadir métricas de delivery
- [ ] Considerar migrar a backend para mayor seguridad