/**
 * ══════════════════════════════════════════════════════════════════════
 *  COMPONENTE — Toast
 *
 *  Notificación flotante que aparece brevemente para confirmar acciones.
 *  Se muestra en la parte inferior de la pantalla con una animación.
 * ══════════════════════════════════════════════════════════════════════
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastComponent {
  @Input() isVisible = false;
  @Input() message = '¡Cambios guardados correctamente!';

  @Output() dismissed = new EventEmitter<void>();
}
