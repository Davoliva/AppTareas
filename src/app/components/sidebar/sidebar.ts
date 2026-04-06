/**
 * ══════════════════════════════════════════════════════════════════════
 *  COMPONENTE — Sidebar
 *
 *  Barra lateral con:
 *    • Branding de la app
 *    • Estadísticas rápidas (pendientes / completadas)
 *    • Barra de progreso
 *    • Navegación de filtros (Todas, Pendientes, Completadas)
 *    • Avatar del usuario + botón "Nueva Tarea"
 *
 *  Inputs:  datos del servicio (contadores, filtro activo, perfil)
 *  Outputs: eventos que el componente padre maneja
 * ══════════════════════════════════════════════════════════════════════
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FilterType } from '../../models/task.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  // ── Inputs (datos que recibe del padre) ──────────────────────────────
  @Input() isOpen = false;
  @Input() activeFilter: FilterType = 'todas';
  @Input() pendingCount = 0;
  @Input() completedCount = 0;
  @Input() totalTasks = 0;
  @Input() progressPercent = 0;
  @Input() userInitials = '?';
  @Input() userAvatarUrl = '';

  // ── Outputs (eventos que emite al padre) ─────────────────────────────
  @Output() closed = new EventEmitter<void>();
  @Output() filterChanged = new EventEmitter<FilterType>();
  @Output() addTaskClicked = new EventEmitter<void>();
  @Output() profileClicked = new EventEmitter<void>();
}
