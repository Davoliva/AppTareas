/**
 * ══════════════════════════════════════════════════════════════════════
 *  COMPONENTE — ProfileModal
 *
 *  Modal de ajustes de perfil donde el usuario puede:
 *    • Ver y cambiar su imagen de avatar (subir archivo)
 *    • Editar nombre y apellidos
 *    • Guardar los cambios (emite evento al padre)
 * ══════════════════════════════════════════════════════════════════════
 */

import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserProfile } from '../../models/task.model';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './profile-modal.html',
  styleUrl: './profile-modal.css',
})
export class ProfileModalComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() userProfile: UserProfile = { nombre: '', apellidos: '', avatarUrl: '' };
  @Input() userInitials = '?';

  @Output() saved = new EventEmitter<UserProfile>();
  @Output() closed = new EventEmitter<void>();

  // ── Formulario ───────────────────────────────────────────────────────
  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: [''],
    avatarUrl: [''],
  });

  /** Pre-rellenar formulario cuando se abra */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.form.setValue({
        nombre: this.userProfile.nombre,
        apellidos: this.userProfile.apellidos,
        avatarUrl: this.userProfile.avatarUrl,
      });
    }
  }

  /** Manejar la selección de un archivo de imagen */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Validar tamaño (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no debe superar los 2 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.form.patchValue({ avatarUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  /** Enviar cambios al padre */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    this.saved.emit({
      nombre: v.nombre?.trim() ?? 'Usuario',
      apellidos: v.apellidos?.trim() ?? '',
      avatarUrl: v.avatarUrl?.trim() ?? '',
    });
  }

  /** Cerrar modal */
  onClose(): void {
    this.closed.emit();
    this.form.reset();
  }
}
