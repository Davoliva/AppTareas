/**
 * ══════════════════════════════════════════════════════════════════════
 *  COMPONENTE — TaskFormModal
 *
 *  Modal reutilizable para CREAR y EDITAR tareas.
 *  Se controla con un @Input() 'mode' que puede ser 'add' o 'edit'.
 *
 *  ¿Cómo funciona?
 *    • Se abre cuando 'isOpen' es true
 *    • Si 'mode' es 'edit', el formulario se pre-rellena con 'editTask'
 *    • Al hacer submit, emite los datos al padre vía 'submitted'
 *    • Al cancelar, emite 'closed'
 * ══════════════════════════════════════════════════════════════════════
 */

import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Task, TaskCategory, TaskPriority } from '../../models/task.model';

/** Datos que emite el formulario al hacer submit */
export interface TaskFormData {
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
}

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './task-form-modal.html',
  styleUrl: './task-form-modal.css',
})
export class TaskFormModalComponent implements OnChanges {
  private fb = inject(FormBuilder);

  /** 'add' para crear, 'edit' para editar */
  @Input() mode: 'add' | 'edit' = 'add';

  /** Controla si el modal está visible */
  @Input() isOpen = false;

  /** Tarea a editar (solo cuando mode === 'edit') */
  @Input() editTask: Task | null = null;

  /** Se emite cuando el usuario envía el formulario */
  @Output() submitted = new EventEmitter<TaskFormData>();

  /** Se emite cuando el usuario cierra el modal */
  @Output() closed = new EventEmitter<void>();

  // ── Formulario ───────────────────────────────────────────────────────
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    category: ['Trabajo' as TaskCategory],
    priority: ['Media' as TaskPriority],
  });

  /** Cuando cambian los inputs, actualizar el formulario */
  ngOnChanges(changes: SimpleChanges): void {
    // Pre-rellenar formulario cuando se abre en modo edición
    if (changes['editTask'] && this.editTask && this.mode === 'edit') {
      this.form.setValue({
        title: this.editTask.title,
        description: this.editTask.description ?? '',
        category: this.editTask.category,
        priority: this.editTask.priority,
      });
    }

    // Resetear formulario cuando se abre en modo agregar
    if (changes['isOpen'] && this.isOpen && this.mode === 'add') {
      this.form.reset({ category: 'Trabajo', priority: 'Media' });
    }
  }

  /** Enviar formulario */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    this.submitted.emit({
      title: v.title!,
      description: v.description ?? '',
      category: v.category as TaskCategory,
      priority: v.priority as TaskPriority,
    });
  }

  /** Cerrar modal */
  onClose(): void {
    this.closed.emit();
    this.form.reset();
  }
}
