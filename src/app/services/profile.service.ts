/**
 * ══════════════════════════════════════════════════════════════════════
 *  SERVICIO DE PERFIL — ProfileService
 *
 *  Responsabilidades:
 *    • Gestionar los datos del perfil de usuario
 *    • Subir y almacenar la imagen de avatar (base64)
 *    • Persistir el perfil en LocalStorage
 *    • Mostrar un toast de confirmación al guardar
 *
 *  ¿Cómo funciona la imagen de avatar?
 *    Se convierte a base64 con FileReader y se guarda en LocalStorage.
 *    Esto tiene un límite práctico de ~2MB por imagen.
 * ══════════════════════════════════════════════════════════════════════
 */

import { Injectable, computed, signal } from '@angular/core';
import { UserProfile } from '../models/task.model';

const PROFILE_KEY = 'tareas-app-profile';

@Injectable({ providedIn: 'root' })
export class ProfileService {

  /** Datos actuales del perfil */
  readonly userProfile = signal<UserProfile>({
    nombre: 'Usuario',
    apellidos: '',
    avatarUrl: '',
  });

  /** Controla la visibilidad del toast de confirmación */
  readonly showSaveToast = signal(false);

  private toastTimeout: ReturnType<typeof setTimeout> | null = null;

  /** Iniciales del usuario para mostrar cuando no hay avatar */
  readonly userInitials = computed(() => {
    const p = this.userProfile();
    const first = p.nombre ? p.nombre.charAt(0).toUpperCase() : '';
    const last = p.apellidos ? p.apellidos.charAt(0).toUpperCase() : '';
    return first + last || '?';
  });

  // ── Inicialización ───────────────────────────────────────────────────

  /** Carga el perfil desde LocalStorage */
  init(): void {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) {
        this.userProfile.set(JSON.parse(raw) as UserProfile);
      }
    } catch {
      // Ignorar — se usa el perfil por defecto
    }
  }

  // ── Actualizar perfil ────────────────────────────────────────────────

  /** Guarda el perfil actualizado en LocalStorage y muestra el toast */
  saveProfile(data: UserProfile): void {
    this.userProfile.set({
      nombre: data.nombre?.trim() ?? 'Usuario',
      apellidos: data.apellidos?.trim() ?? '',
      avatarUrl: data.avatarUrl?.trim() ?? '',
    });

    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(this.userProfile()));
    } catch {
      console.error('Error al guardar perfil en LocalStorage');
    }

    this.triggerSaveToast();
  }

  // ── Toast de confirmación ────────────────────────────────────────────

  /** Muestra el toast durante 3 segundos */
  private triggerSaveToast(): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.showSaveToast.set(true);
    this.toastTimeout = setTimeout(() => {
      this.showSaveToast.set(false);
    }, 3000);
  }

  /** Oculta el toast manualmente (si el usuario lo cierra) */
  dismissToast(): void {
    this.showSaveToast.set(false);
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }

  // ── Utilidad: leer archivo de avatar ─────────────────────────────────

  /**
   * Convierte un archivo de imagen a base64 (DataURL).
   * Devuelve una Promise que resuelve con el DataURL o rechaza si falla.
   */
  readAvatarFile(file: File): Promise<string> {
    // Validar tamaño (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return Promise.reject(new Error('La imagen no debe superar los 2 MB'));
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsDataURL(file);
    });
  }
}
