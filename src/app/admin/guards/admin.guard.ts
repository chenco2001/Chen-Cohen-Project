import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(
    private users: UsersService,
    private router: Router
  ) {}

  canActivate() {
    return this.users.getCurrentUser().pipe(
      map(user => {
        if (user && (Number(user.id) === 1 || user.role === 'admin')) return true;
        this.router.navigate(['/profile']);
        return false;
      })
    );
  }

  
}