/**
 * ══════════════════════════════════════════════════════════════════════
 *  SERVICIO DE TAREAS — TaskService
 *
 *  Responsabilidades:
 *    • CRUD completo de tareas (crear, leer, editar, eliminar)
 *    • Marcar tareas como completadas / pendientes
 *    • Persistencia automática en LocalStorage
 *    • Filtrado y búsqueda de tareas
 *
 *  ¿Cómo agregar una nueva funcionalidad?
 *    1. Crea un nuevo método público en este servicio
 *    2. Actualiza el signal `tasks` con this.tasks.update(...)
 *    3. Llama a this.saveToStorage() para persistir los cambios
 * ══════════════════════════════════════════════════════════════════════
 */

import { Injectable, computed, signal } from '@angular/core';
import { Task, FilterType } from '../models/task.model';

/** Clave usada para guardar las tareas en LocalStorage */
const STORAGE_KEY = 'tareas-app-tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {

  // ── Estado reactivo (signals) ────────────────────────────────────────
  /** Lista completa de tareas */
  readonly tasks = signal<Task[]>([]);

  /** Filtro activo actualmente */
  readonly activeFilter = signal<FilterType>('todas');

  /** Texto de búsqueda actual */
  readonly searchQuery = signal('');

  // ── Datos calculados (computed) ──────────────────────────────────────
  /** Tareas filtradas según el filtro y la búsqueda activa */
  readonly filteredTasks = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    let list = this.tasks();

    // Filtrar por texto de búsqueda
    if (query) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description ?? '').toLowerCase().includes(query)
      );
    }

    // Filtrar por estado (todas / pendientes / completadas)
    switch (this.activeFilter()) {
      case 'pendientes':
        return list.filter((t) => !t.completed);
      case 'completadas':
        return list.filter((t) => t.completed);
      default:
        return list;
    }
  });

  /** Total de tareas */
  readonly totalTasks = computed(() => this.tasks().length);

  /** Cantidad de tareas completadas */
  readonly completedCount = computed(
    () => this.tasks().filter((t) => t.completed).length
  );

  /** Cantidad de tareas pendientes */
  readonly pendingCount = computed(
    () => this.tasks().filter((t) => !t.completed).length
  );

  /** Porcentaje de progreso (0–100) */
  readonly progressPercent = computed(() =>
    this.totalTasks() === 0
      ? 0
      : Math.round((this.completedCount() / this.totalTasks()) * 100)
  );

  // ── Inicialización ───────────────────────────────────────────────────
  /** Carga las tareas desde LocalStorage (llamar en ngOnInit del componente raíz) */
  init(): void {
    this.loadFromStorage();
  }

  // ── CRUD ─────────────────────────────────────────────────────────────

  /** Agrega una nueva tarea al inicio de la lista */
  addTask(data: Pick<Task, 'title' | 'description' | 'category' | 'priority'>): void {
    const newTask: Task = {
      id: this.nextId(),
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      category: data.category,
      priority: data.priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    this.tasks.update((tasks) => [newTask, ...tasks]);
    this.saveToStorage();
  }

  /** Actualiza los campos de una tarea existente */
  updateTask(
    id: number,
    data: Pick<Task, 'title' | 'description' | 'category' | 'priority'>
  ): void {
    this.tasks.update((tasks) =>
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              title: data.title.trim(),
              description: data.description?.trim() || undefined,
              category: data.category,
              priority: data.priority,
            }
          : t
      )
    );
    this.saveToStorage();
  }

  /** Alterna el estado completada/pendiente de una tarea */
  toggleTask(id: number): void {
    this.tasks.update((tasks) =>
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
    this.saveToStorage();
  }

  /** Elimina una tarea por su ID */
  deleteTask(id: number): void {
    this.tasks.update((tasks) => tasks.filter((t) => t.id !== id));
    this.saveToStorage();
  }

  // ── Filtros ──────────────────────────────────────────────────────────

  /** Cambia el filtro activo */
  setFilter(filter: FilterType): void {
    this.activeFilter.set(filter);
  }

  /** Actualiza el texto de búsqueda */
  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  // ── Persistencia (LocalStorage) ──────────────────────────────────────

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.tasks.set(JSON.parse(raw) as Task[]);
      } else {
        // Primera vez: cargar datos de ejemplo
        this.tasks.set(this.getDefaultTasks());
        this.saveToStorage();
      }
    } catch {
      this.tasks.set(this.getDefaultTasks());
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks()));
    } catch {
      console.error('Error al guardar tareas en LocalStorage');
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────

  private nextId(): number {
    const tasks = this.tasks();
    return tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1;
  }

  /** Tareas que se muestran la primera vez que un usuario abre la app */
  private getDefaultTasks(): Task[] {
    const now = new Date().toISOString();
    return [
      {
        id: 1,
        title: 'Revisar guías de diseño trimestrales',
        description: 'Revisar y actualizar las guías de estilo para el Q4',
        category: 'Trabajo',
        priority: 'Alta',
        completed: false,
        createdAt: now,
      },
      {
        id: 2,
        title: 'Comprar café para la oficina',
        description: 'Café italiano expreso, 1kg',
        category: 'Personal',
        priority: 'Media',
        completed: false,
        createdAt: now,
      },
      {
        id: 3,
        title: "Leer 'El diseño como arte'",
        description: 'Primer capítulo: introducción',
        category: 'Ideas',
        priority: 'Baja',
        completed: true,
        createdAt: now,
      },
    ];
  }
}
