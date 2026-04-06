/**
 * ══════════════════════════════════════════════════════════════════════
 *  COMPONENTE — Topbar
 *
 *  Barra superior con:
 *    • Botón hamburguesa (móvil) para abrir el sidebar
 *    • Título de la sección
 *    • Caja de búsqueda
 *    • Toggle de tema claro/oscuro (switch deslizante)
 *    • Botón "Nueva Tarea" (solo desktop)
 * ══════════════════════════════════════════════════════════════════════
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class TopbarComponent {
  @Input() searchQuery = '';
  @Input() darkMode = false;

  @Output() sidebarToggled = new EventEmitter<void>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() themeToggled = new EventEmitter<void>();
  @Output() addTaskClicked = new EventEmitter<void>();

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChanged.emit(value);
  }

  clearSearch(): void {
    this.searchChanged.emit('');
  }
}
