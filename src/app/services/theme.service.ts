import { Injectable } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'ui:theme'; 

  constructor() {
    this.applySavedTheme();
  }

  toggle() {
    const next: ThemeMode = this.isDark() ? 'light' : 'dark';
    this.setTheme(next);
  }

  setTheme(mode: ThemeMode) {
    localStorage.setItem(this.THEME_KEY, mode);
    this.apply(mode);
  }

  isDark(): boolean {
    return localStorage.getItem(this.THEME_KEY) === 'dark';
  }

  private applySavedTheme() {
    const saved = localStorage.getItem(this.THEME_KEY) as ThemeMode | null;
    this.apply(saved === 'dark' ? 'dark' : 'light');
  }

  private apply(mode: ThemeMode) {
    document.body.classList.toggle('dark', mode === 'dark');
  }
}