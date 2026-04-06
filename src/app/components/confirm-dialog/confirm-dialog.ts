/**
 * ══════════════════════════════════════════════════════════════════════
 *  COMPONENTE — ConfirmDialog
 *
 *  Diálogo genérico de confirmación. Se usa para confirmar eliminaciones
 *  pero se puede reutilizar para cualquier acción destructiva.
 * ══════════════════════════════════════════════════════════════════════
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmar acción';
  @Input() message = '¿Estás seguro?';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
