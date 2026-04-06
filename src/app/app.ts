/**
 * ══════════════════════════════════════════════════════════════════════
 *  COMPONENTE RAÍZ — App
 *
 *  Este es el componente principal que ORQUESTA toda la aplicación.
 *  NO tiene lógica de negocio propia — delega todo a los servicios.
 *
 *  Responsabilidades:
 *    • Inicializar los servicios al arrancar (ngOnInit)
 *    • Conectar los componentes hijos con los servicios
 *    • Gestionar qué modales están abiertos/cerrados
 *
 *  ┌─────────────────────────────────────────────────────────────────┐
 *  │  ARQUITECTURA DE LA APP                                        │
 *  │                                                                 │
 *  │  models/       → Interfaces y tipos de datos                   │
 *  │  services/     → Lógica de negocio + persistencia              │
 *  │  components/   → Piezas de UI reutilizables                    │
 *  │  app.*         → Componente raíz (este archivo)                │
 *  │                                                                 │
 *  │  ¿Quieres agregar una nueva funcionalidad?                     │
 *  │    1. Crea/edita el modelo en models/task.model.ts             │
 *  │    2. Añade la lógica en el servicio correspondiente           │
 *  │    3. Crea un componente nuevo en components/                  │
 *  │    4. Integra el componente aquí en app.html                   │
 *  └─────────────────────────────────────────────────────────────────┘
 * ══════════════════════════════════════════════════════════════════════
 */

import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

// ── Servicios ──────────────────────────────────────────────────────────
import { TaskService } from './services/task.service';
import { ThemeService } from './services/theme.service';
import { ProfileService } from './services/profile.service';

// ── Modelos ────────────────────────────────────────────────────────────
import { Task, FilterType, UserProfile } from './models/task.model';

// ── Componentes hijos ──────────────────────────────────────────────────
import { SidebarComponent } from './components/sidebar/sidebar';
import { TopbarComponent } from './components/topbar/topbar';
import { FilterTabsComponent } from './components/filter-tabs/filter-tabs';
import { TaskCardComponent } from './components/task-card/task-card';
import { TaskFormModalComponent, TaskFormData } from './components/task-form-modal/task-form-modal';
import { ProfileModalComponent } from './components/profile-modal/profile-modal';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog';
import { ToastComponent } from './components/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatIconModule,
    SidebarComponent,
    TopbarComponent,
    FilterTabsComponent,
    TaskCardComponent,
    TaskFormModalComponent,
    ProfileModalComponent,
    ConfirmDialogComponent,
    ToastComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {

  // ── Inyección de servicios ───────────────────────────────────────────
  readonly taskService = inject(TaskService);
  readonly themeService = inject(ThemeService);
  readonly profileService = inject(ProfileService);

  // ── Estado de UI (solo modales y sidebar) ────────────────────────────
  sidebarOpen = signal(false);
  showAddModal = signal(false);
  editingTask = signal<Task | null>(null);
  deleteTaskId = signal<number | null>(null);
  showProfileModal = signal(false);

  // ── Ciclo de vida ────────────────────────────────────────────────────
  ngOnInit(): void {
    this.taskService.init();
    this.themeService.init();
    this.profileService.init();
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SIDEBAR
  // ═══════════════════════════════════════════════════════════════════

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  // ═══════════════════════════════════════════════════════════════════
  //  FILTROS
  // ═══════════════════════════════════════════════════════════════════

  onFilterChanged(filter: FilterType): void {
    this.taskService.setFilter(filter);
  }

  onSearchChanged(query: string): void {
    this.taskService.setSearchQuery(query);
  }

  // ═══════════════════════════════════════════════════════════════════
  //  TAREAS — Crear
  // ═══════════════════════════════════════════════════════════════════

  openAddModal(): void {
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
  }

  onTaskAdded(data: TaskFormData): void {
    this.taskService.addTask(data);
    this.closeAddModal();
  }

  // ═══════════════════════════════════════════════════════════════════
  //  TAREAS — Editar
  // ═══════════════════════════════════════════════════════════════════

  openEditModal(task: Task): void {
    this.editingTask.set(task);
  }

  closeEditModal(): void {
    this.editingTask.set(null);
  }

  onTaskEdited(data: TaskFormData): void {
    const task = this.editingTask();
    if (task) {
      this.taskService.updateTask(task.id, data);
      this.closeEditModal();
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  //  TAREAS — Toggle y Eliminar
  // ═══════════════════════════════════════════════════════════════════

  onTaskToggled(id: number): void {
    this.taskService.toggleTask(id);
  }

  openDeleteConfirm(id: number): void {
    this.deleteTaskId.set(id);
  }

  closeDeleteConfirm(): void {
    this.deleteTaskId.set(null);
  }

  onDeleteConfirmed(): void {
    const id = this.deleteTaskId();
    if (id !== null) {
      this.taskService.deleteTask(id);
      this.closeDeleteConfirm();
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  //  PERFIL
  // ═══════════════════════════════════════════════════════════════════

  openProfileModal(): void {
    this.showProfileModal.set(true);
  }

  closeProfileModal(): void {
    this.showProfileModal.set(false);
  }

  onProfileSaved(profile: UserProfile): void {
    this.profileService.saveProfile(profile);
    this.closeProfileModal();
  }

  // ═══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ═══════════════════════════════════════════════════════════════════

  trackById(_: number, task: Task): number {
    return task.id;
  }
}
