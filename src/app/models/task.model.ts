/**
 * ══════════════════════════════════════════════════════════════════════
 *  MODELOS DE DATOS — Tareas Pendientes
 *
 *  Este archivo contiene TODAS las interfaces y tipos de la app.
 *  Si necesitas agregar un nuevo campo a una tarea, hazlo aquí.
 * ══════════════════════════════════════════════════════════════════════
 */

/** Representa una tarea individual */
export interface Task {
  id: number;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
  createdAt: string; // ISO 8601
}

/** Categorías disponibles para las tareas */
export type TaskCategory = 'Trabajo' | 'Personal' | 'Ideas';

/** Niveles de prioridad */
export type TaskPriority = 'Alta' | 'Media' | 'Baja';

/** Filtros para la vista de tareas */
export type FilterType = 'todas' | 'pendientes' | 'completadas';

/** Datos del perfil de usuario */
export interface UserProfile {
  nombre: string;
  apellidos: string;
  avatarUrl: string;
}
