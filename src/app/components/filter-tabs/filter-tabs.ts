/**
 * ══════════════════════════════════════════════════════════════════════
 *  COMPONENTE — FilterTabs
 *
 *  Pestañas de filtro rápido: Todas / Pendientes / Completadas
 *  Muestra un contador junto a cada pestaña.
 * ══════════════════════════════════════════════════════════════════════
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterType } from '../../models/task.model';

@Component({
  selector: 'app-filter-tabs',
  standalone: true,
  templateUrl: './filter-tabs.html',
  styleUrl: './filter-tabs.css',
})
export class FilterTabsComponent {
  @Input() activeFilter: FilterType = 'todas';
  @Input() totalTasks = 0;
  @Input() pendingCount = 0;
  @Input() completedCount = 0;

  @Output() filterChanged = new EventEmitter<FilterType>();
}
