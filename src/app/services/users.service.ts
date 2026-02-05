import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, switchMap } from 'rxjs';

export type Gender = 'male' | 'female';
export type Role = 'user' | 'admin';

export interface User {
  id?: string | number;
  email: string;
  password: string;
  fullName: string;
  birthDate: string;
  gender: Gender;

  imageUrl?: string;
  image?: string;

  role?: Role;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private apiUrl = 'http://localhost:3001/users';
  private sessionKey = 'loggedUserEmail';

  constructor(private http: HttpClient) {}

  private normalizeEmail(email: string): string {
    return (email || '').trim().toLowerCase();
  }

  private defaultImageByGender(gender: Gender): string {
    return gender === 'male' ? 'assets/user/male.png' : 'assets/user/female.png';
  }

  private normalizeUser(u: User): User {
    const img = u.imageUrl || u.image || this.defaultImageByGender(u.gender);

    const dbRole: Role = u.role === 'admin' ? 'admin' : 'user';
    const role: Role = (Number(u.id) === 1) ? 'admin' : dbRole;

    return { ...u, imageUrl: img, image: img, role };
  }

  getLoggedEmail(): string | null {
    return sessionStorage.getItem(this.sessionKey);
  }

  logout(): void {
    sessionStorage.removeItem(this.sessionKey);
  }

  getUserByEmail(email: string): Observable<User | null> {
    const e = this.normalizeEmail(email);
    if (!e) return of(null);

    return this.http
      .get<User[]>(`${this.apiUrl}?email=${encodeURIComponent(e)}`)
      .pipe(map(arr => (arr.length ? this.normalizeUser(arr[0]) : null)));
  }

  getCurrentUser(): Observable<User | null> {
    const email = this.getLoggedEmail();
    if (!email) return of(null);
    return this.getUserByEmail(email);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(list => list.map(u => this.normalizeUser(u)))
    );
  }

  isAdmin(user: User | null): boolean {
    if (!user) return false;
    return Number(user.id) === 1 || user.role === 'admin';
  }

  login(email: string, password: string): Observable<{ ok: boolean; user?: User; error?: string }> {
    const e = this.normalizeEmail(email);
    if (!e || !password) return of({ ok: false, error: 'Email and password are required.' });

    return this.getUserByEmail(e).pipe(
      map(user => {
        if (!user || user.password !== password) {
          return { ok: false, error: 'Invalid email or password.' };
        }
        sessionStorage.setItem(this.sessionKey, user.email);
        return { ok: true, user };
      })
    );
  }

  register(payload: {
    email: string;
    password: string;
    fullName: string;
    birthDate: string;
    gender: Gender;
    imageUrl?: string;
  }): Observable<{ ok: boolean; error?: string }> {
    const e = this.normalizeEmail(payload.email);

    if (!e || !payload.password || !payload.fullName || !payload.birthDate || !payload.gender) {
      return of({ ok: false, error: 'All fields are required.' });
    }

    return this.getUserByEmail(e).pipe(
      switchMap(existing => {
        if (existing) return of({ ok: false, error: 'User already exists.' });

        const newUser: User = {
          email: e,
          password: payload.password,
          fullName: payload.fullName,
          birthDate: payload.birthDate,
          gender: payload.gender,
          imageUrl: payload.imageUrl && payload.imageUrl.trim()
            ? payload.imageUrl
            : this.defaultImageByGender(payload.gender),
          role: 'user',
        };

        return this.http.post<User>(this.apiUrl, newUser).pipe(
          map(() => ({ ok: true }))
        );
      })
    );
  }

  updateUser(id: string | number, patch: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, patch).pipe(
      map(u => this.normalizeUser(u))
    );
  }

  deleteUser(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}