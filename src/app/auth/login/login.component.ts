import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService, User } from '../../services/users.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm!: FormGroup;

  loading = false;
  error = '';
  success = false;
  loggedInUser: User | null = null;

  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private usersSvc: UsersService,
    private cartService: CartService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.usersSvc.getCurrentUser().subscribe(u => {
      this.loggedInUser = u;

      // חשוב: אם כבר מחובר, לעדכן גם את העגלה
      this.cartService.updateUser(u);
    });
  }

  login(): void {
    this.error = '';
    this.errorMessage = '';
    this.success = false;

    if (this.loginForm.invalid) {
      this.error = 'Please enter a valid email and password.';
      this.errorMessage = this.error;
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.loading = true;
    this.isLoading = true;

    this.usersSvc.login(email, password).subscribe({
      next: res => {
        this.loading = false;
        this.isLoading = false;

        if (!res.ok || !res.user) {
          this.error = res.error || 'Login failed.';
          this.errorMessage = this.error;

          // אם נכשל -> לוודא שהעגלה לא “חושבת” שיש משתמש
          this.cartService.updateUser(null);
          return;
        }

        this.loggedInUser = res.user;
        this.success = true;

        // ✅ כאן נכון לעדכן משתמש בעגלה
        this.cartService.updateUser(res.user);

        this.router.navigate(['/profile']);
      },
      error: () => {
        this.loading = false;
        this.isLoading = false;
        this.error = 'Cannot connect to json-server. Make sure it runs on port 3001.';
        this.errorMessage = this.error;
      },
    });
  }

  logout(): void {
    this.usersSvc.logout();
    this.cartService.updateUser(null);

    this.loggedInUser = null;
    this.success = false;

    this.router.navigate(['/profile']);
  }
}