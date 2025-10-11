/**
 * Cliente HTTP para comunicarse con la API de reportes
 * Proporciona funciones para hacer peticiones a la API Flask que corre en puerto 5001
 */

// Configuración base de la API
// En desarrollo usamos el proxy de Vite (/api -> http://localhost:5001)
// En producción apuntamos directamente al servidor
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isDevelopment ? '/api' : 'http://localhost:5001';

// Tipos para la API de reportes
export interface EventoLog {
  id: number;
  evento_id: number;
  nombre: string;
  fecha: string;
  hora: string;
  ubicacion: string;
  tipo_operacion: 'add' | 'delete';
  fecha_operacion: string;
}

export interface ReporteVenta {
  id: number;
  fecha_venta: string;
  cantidad: number;
  precio_unitario: number;
  total: number;
  cliente_nombre: string;
  cliente_rut: string;
  metodo_pago: string;
  evento_nombre: string;
  fecha_evento: string;
  lugar: string;
  sector_nombre: string;
}

export interface ResumenEjecutivo {
  total_ventas: number;
  total_entradas: number;
  promedio_venta: number;
  sector_mas_vendido: string | null;
  sector_mayor_ingreso: string | null;
}

export interface ReporteVentasResponse {
  success: boolean;
  resumen_ejecutivo: ResumenEjecutivo;
  analisis_por_sector: Record<string, {
    entradas_vendidas: number;
    total_ventas: number;
    precio_promedio: number;
  }>;
  analisis_por_evento: Record<string, {
    total_ventas: number;
    total_entradas: number;
  }>;
  datos_detallados: ReporteVenta[];
  filtros_aplicados: {
    evento_id?: number;
    fecha_inicio?: string;
    fecha_fin?: string;
    sector_id?: number;
  };
  total_registros: number;
}

export interface EventoLogResponse {
  success: boolean;
  logs: EventoLog[];
  total: number;
}

export interface EventoRequest {
  evento_id: number;
  nombre: string;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:MM:SS
  ubicacion: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  detalle?: string;
  evento?: T;
}

/**
 * Función genérica para hacer peticiones HTTP
 */
async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...options,
  };

  try {
    console.log(`🌐 Haciendo petición ${options.method || 'GET'} a: ${url}`);
    
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Respuesta exitosa de ${endpoint}:`, data);
    return data;
    
  } catch (error) {
    console.error(`❌ Error en petición a ${endpoint}:`, error);
    throw error;
  }
}

/**
 * SERVICIO DE EVENTOS - Para gestión de logs de eventos
 */
export const eventosService = {
  /**
   * Agregar un evento al log del sistema
   */
  async agregarEvento(evento: EventoRequest): Promise<ApiResponse<EventoLog>> {
    return fetchAPI<ApiResponse<EventoLog>>('/eventos/add', {
      method: 'POST',
      body: JSON.stringify(evento),
    });
  },

  /**
   * Eliminar un evento del sistema
   */
  async eliminarEvento(evento: EventoRequest): Promise<ApiResponse<EventoLog>> {
    return fetchAPI<ApiResponse<EventoLog>>('/eventos/delete', {
      method: 'DELETE',
      body: JSON.stringify(evento),
    });
  },

  /**
   * Obtener todos los logs de eventos
   */
  async obtenerLogs(filtros?: {
    tipo_operacion?: 'add' | 'delete';
    evento_id?: number;
  }): Promise<EventoLogResponse> {
    const params = new URLSearchParams();
    if (filtros?.tipo_operacion) {
      params.append('tipo_operacion', filtros.tipo_operacion);
    }
    if (filtros?.evento_id) {
      params.append('evento_id', filtros.evento_id.toString());
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/eventos/logs?${queryString}` : '/eventos/logs';
    
    return fetchAPI<EventoLogResponse>(endpoint);
  },
};

/**
 * SERVICIO DE REPORTES - Para obtener reportes de ventas
 */
export const reportesService = {
  /**
   * Obtener reporte de ventas con filtros opcionales
   */
  async obtenerReporteVentas(filtros?: {
    evento_id?: number;
    fecha_inicio?: string;
    fecha_fin?: string;
    sector_id?: number;
    formato?: 'json' | 'pdf' | 'excel';
  }): Promise<ReporteVentasResponse> {
    const params = new URLSearchParams();
    
    if (filtros?.evento_id) {
      params.append('evento_id', filtros.evento_id.toString());
    }
    if (filtros?.fecha_inicio) {
      params.append('fecha_inicio', filtros.fecha_inicio);
    }
    if (filtros?.fecha_fin) {
      params.append('fecha_fin', filtros.fecha_fin);
    }
    if (filtros?.sector_id) {
      params.append('sector_id', filtros.sector_id.toString());
    }
    if (filtros?.formato) {
      params.append('formato', filtros.formato);
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/reportes/ventas?${queryString}` : '/reportes/ventas';
    
    return fetchAPI<ReporteVentasResponse>(endpoint);
  },

  /**
   * Descargar reporte en formato PDF
   */
  async descargarReportePDF(filtros?: {
    evento_id?: number;
    fecha_inicio?: string;
    fecha_fin?: string;
    sector_id?: number;
  }): Promise<Blob> {
    const params = new URLSearchParams();
    params.append('formato', 'pdf');
    
    if (filtros?.evento_id) {
      params.append('evento_id', filtros.evento_id.toString());
    }
    if (filtros?.fecha_inicio) {
      params.append('fecha_inicio', filtros.fecha_inicio);
    }
    if (filtros?.fecha_fin) {
      params.append('fecha_fin', filtros.fecha_fin);
    }
    if (filtros?.sector_id) {
      params.append('sector_id', filtros.sector_id.toString());
    }

    const url = `${API_BASE_URL}/reportes/ventas?${params.toString()}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error descargando PDF: ${response.statusText}`);
    }
    
    return response.blob();
  },

  /**
   * Descargar reporte en formato Excel
   */
  async descargarReporteExcel(filtros?: {
    evento_id?: number;
    fecha_inicio?: string;
    fecha_fin?: string;
    sector_id?: number;
  }): Promise<Blob> {
    const params = new URLSearchParams();
    params.append('formato', 'excel');
    
    if (filtros?.evento_id) {
      params.append('evento_id', filtros.evento_id.toString());
    }
    if (filtros?.fecha_inicio) {
      params.append('fecha_inicio', filtros.fecha_inicio);
    }
    if (filtros?.fecha_fin) {
      params.append('fecha_fin', filtros.fecha_fin);
    }
    if (filtros?.sector_id) {
      params.append('sector_id', filtros.sector_id.toString());
    }

    const url = `${API_BASE_URL}/reportes/ventas?${params.toString()}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error descargando Excel: ${response.statusText}`);
    }
    
    return response.blob();
  },
};

/**
 * Utilidad para descargar archivos blob
 */
export function descargarArchivo(blob: Blob, nombreArchivo: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Hook personalizado para verificar el estado de la API
 */
export async function verificarConexionAPI(): Promise<boolean> {
  try {
    // En desarrollo, verificamos la conexión a través del proxy
    const url = isDevelopment ? '/api/docs/' : `${API_BASE_URL}/docs/`;
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    console.error('❌ API no disponible:', error);
    return false;
  }
}