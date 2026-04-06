/**
 * ══════════════════════════════════════════════════════════════════════
 *  SERVICIO DE TEMA — ThemeService
 *
 *  Responsabilidades:
 *    • Alternar entre tema claro y oscuro
 *    • Persistir la preferencia en LocalStorage
 *    • Aplicar la clase CSS 'dark-theme' al <html>
 *
 *  ¿Cómo funciona?
 *    El tema se controla añadiendo/quitando la clase 'dark-theme'
 *    en el elemento <html>. Los estilos CSS usan variables que cambian
 *    según esta clase (ver styles.css global).
 * ══════════════════════════════════════════════════════════════════════
 */

import { Injectable, signal } from '@angular/core';

const THEME_KEY = 'tareas-app-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  /** true = modo oscuro, false = modo claro */
  readonly darkMode = signal(false);

  /** Carga la preferencia guardada (llamar en ngOnInit del componente raíz) */
  init(): void {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark') {
        this.darkMode.set(true);
        document.documentElement.classList.add('dark-theme');
      }
    } catch {
      // Si falla, se queda en modo claro
    }
  }

  /** Alterna entre tema claro y oscuro */
  toggle(): void {
    const newVal = !this.darkMode();
    this.darkMode.set(newVal);

    if (newVal) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }

    try {
      localStorage.setItem(THEME_KEY, newVal ? 'dark' : 'light');
    } catch {
      // Ignorar errores de almacenamiento
    }
  }
}
