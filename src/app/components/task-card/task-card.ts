/**
 * ══════════════════════════════════════════════════════════════════════
 *  COMPONENTE — TaskCard
 *
 *  Tarjeta individual de una tarea. Muestra:
 *    • Checkbox para completar/descompletar
 *    • Título y descripción
 *    • Categoría, prioridad y fecha
 *    • Botones de editar y eliminar (hover / siempre en móvil)
 * ══════════════════════════════════════════════════════════════════════
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Task, TaskCategory } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;

  @Output() toggled = new EventEmitter<number>();
  @Output() edited = new EventEmitter<Task>();
  @Output() deleted = new EventEmitter<number>();

  /** Devuelve el icono según la categoría */
  getCategoryIcon(cat: TaskCategory): string {
    switch (cat) {
      case 'Trabajo':  return 'work';
      case 'Personal': return 'person';
      case 'Ideas':    return 'lightbulb';
    }
  }

  /** Formatea la fecha ISO a formato legible en español */
  formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  }
}
