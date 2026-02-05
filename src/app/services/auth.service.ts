import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:3001';
  private LS_KEY = 'currentUser';

  constructor(private http: HttpClient) {}

  async register(name: string, email: string, password: string) {
    try {
      const cleanEmail = email.trim().toLowerCase();

      const existing = await firstValueFrom(
        this.http.get<any[]>(`${this.api}/users?email=${encodeURIComponent(cleanEmail)}`)
      );

      if (existing.length > 0) {
        return { ok: false, msg: 'Email already exists.' };
      }

      const newUser = {
        name: name.trim(),
        email: cleanEmail,
        password,
        createdAt: new Date().toISOString(),
      };

      const created = await firstValueFrom(this.http.post<any>(`${this.api}/users`, newUser));
      localStorage.setItem(this.LS_KEY, JSON.stringify(created));

      return { ok: true };
    } catch {
      return { ok: false, msg: 'Register failed. Please try again.' };
    }
  }

  async login(email: string, password: string) {
    try {
      const cleanEmail = email.trim().toLowerCase();

      const users = await firstValueFrom(
        this.http.get<any[]>(`${this.api}/users?email=${encodeURIComponent(cleanEmail)}`)
      );

      const u = users[0];
      if (!u) return { ok: false, msg: 'User not found.' };
      if (u.password !== password) return { ok: false, msg: 'Wrong password.' };

      localStorage.setItem(this.LS_KEY, JSON.stringify(u));
      return { ok: true };
    } catch {
      return { ok: false, msg: 'Login failed. Please try again.' };
    }
  }

  logout() {
    localStorage.removeItem(this.LS_KEY);
  }

  getCurrentUser() {
    const raw = localStorage.getItem(this.LS_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}