import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService, User, Gender } from '../../services/users.service';

@Component({
  selector: 'app-profile-edit',
  standalone: false,
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
})
export class ProfileEditComponent {
  user: User | null = null;

  form!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private usersSvc: UsersService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', [Validators.required]],
      gender: ['male' as Gender, [Validators.required]],
      imageUrl: [''], // optional
    });
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.usersSvc.getCurrentUser().subscribe({
      next: (u) => {
        this.isLoading = false;

        if (!u) {
          this.router.navigate(['/profile/login']);
          return;
        }

        this.user = u;

        this.form.patchValue({
          fullName: u.fullName,
          birthDate: u.birthDate,
          gender: u.gender,
          imageUrl: u.imageUrl || u.image || '',
        });
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Cannot load user.';
      },
    });
  }

  save(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.user?.id) {
      this.errorMessage = 'User not found.';
      return;
    }

    if (this.form.invalid) {
      this.errorMessage = 'Please fill all fields correctly.';
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    this.isLoading = true;

    const patch: Partial<User> = {
      fullName: v.fullName,
      birthDate: v.birthDate,
      gender: v.gender,
      imageUrl: (v.imageUrl || '').trim(),
      // keep compatibility if some templates use "image"
      image: (v.imageUrl || '').trim(),
    };

    this.usersSvc.updateUser(this.user.id, patch).subscribe({
      next: (updated) => {
        this.isLoading = false;
        this.successMessage = 'Profile updated!';
        // go back to profile page (UserDetails as default)
        setTimeout(() => this.router.navigate(['/profile']), 500);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Update failed.';
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }

  
}