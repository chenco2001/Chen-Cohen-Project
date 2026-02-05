import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService, User } from '../../services/users.service';

@Component({
  selector: 'app-user-details',
  standalone: false,
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent {
  user: User | null = null;
  isLoading = false;
  error = '';
  success = '';

  constructor(private usersSvc: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.usersSvc.getCurrentUser().subscribe({
      next: u => {
        this.isLoading = false;
        if (!u) {
          this.router.navigate(['/profile/login']);
          return;
        }
        this.user = u;
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Cannot load user.';
      }
    });
  }

goToEdit(): void {
  this.router.navigate(['/profile/edit']);
}

  logout(): void {
    this.user = null;
    this.router.navigate(['/profile']);
    window.location.reload();
  }
}