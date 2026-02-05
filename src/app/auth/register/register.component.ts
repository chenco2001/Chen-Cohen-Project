import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService, Gender } from '../../services/users.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  readonly minBirthDate = '1900-01-01';

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usersSvc: UsersService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        birthDate: ['', [Validators.required, this.minIsoDateValidator(this.minBirthDate), this.minAgeValidator(18)]],
        gender: ['male' as Gender, [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [this.passwordsMatchValidator()] }
    );
  }

  get f() {
    return this.form.controls;
  }

  private minIsoDateValidator(minIso: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = String(control.value || '').trim();
      if (!v) return null;

      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return { dateFormat: true };
      if (v < minIso) return { dateMin: true };

      return null;
    };
  }

  private minAgeValidator(minAgeYears: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = String(control.value || '').trim();
      if (!v) return null;

      const dob = new Date(v);
      if (Number.isNaN(dob.getTime())) return { dateInvalid: true };

      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();

      // בודק שנה+חודש+יום כדי לדעת אם כבר עבר יום ההולדת השנה
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

      return age >= minAgeYears ? null : { underAge: true };
    };
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const p1 = group.get('password')?.value ?? '';
      const p2 = group.get('confirmPassword')?.value ?? '';
      if (!p1 || !p2) return null;
      return p1 === p2 ? null : { passwordsMismatch: true };
    };
  }

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      this.errorMessage = 'Please fill all fields correctly.';
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    this.isLoading = true;

    this.usersSvc
      .register({
        email: v.email,
        password: v.password,
        fullName: v.fullName,
        birthDate: v.birthDate,
        gender: v.gender,
      })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (!res.ok) {
            this.errorMessage = res.error || 'Registration failed.';
            return;
          }
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/profile']), 600);
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Cannot connect to json-server. Make sure it runs on port 3001.';
        },
      });
  }
}