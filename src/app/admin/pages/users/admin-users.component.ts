import { Component, OnInit } from '@angular/core';
import { UsersService, User } from '../../../services/users.service';

type Role = 'user' | 'admin';

@Component({
  selector: 'app-admin-users',
  standalone: false,
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error = '';

  constructor(private usersSvc: UsersService) {}

  ngOnInit(): void {
    this.usersSvc.getAllUsers().subscribe({
      next: list => {
        this.users = list;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load users';
        this.loading = false;
      },
    });
  }

  isAdmin(u: User): boolean {
    return this.isSuperAdmin(u) || u.role === 'admin';
  }

  getRole(u: User): Role {
    return u.role === 'admin' ? 'admin' : 'user';
  }

  isSuperAdmin(u: User): boolean {
  return String(u.id) === '1';
}

changeRole(u: User, role: 'user' | 'admin'): void {
  if (this.isSuperAdmin(u)) return;

  if (u.id === undefined || u.id === null) {
    this.error = 'User id is missing';
    return;
  }

  this.usersSvc.updateUser(u.id, { role }).subscribe({
    next: updated => {
      const idx = this.users.findIndex(x => x.id === u.id);
      if (idx !== -1) this.users[idx] = updated;
    },
    error: () => {
      this.error = 'Failed to update role';
    },
  });
}

  deleteUser(u: User): void {
    if (this.isSuperAdmin(u)) return; 

        this.usersSvc.deleteUser(u.id!).subscribe({
        next: () => {
        this.users = this.users.filter(x => x.id !== u.id);
      },
      error: () => {
        this.error = 'Delete failed';
      },
    });
  }
}