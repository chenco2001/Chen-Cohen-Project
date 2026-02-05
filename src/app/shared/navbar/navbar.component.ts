import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { UsersService, User } from '../../services/users.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: User | null = null;
  private sub?: Subscription;

  menuOpen = false;

  constructor(
    private users: UsersService,
    private router: Router,
    public theme: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadUser();

    this.sub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUser();
        this.menuOpen = false;
      });
  }

  private loadUser(): void {
    this.users.getCurrentUser().subscribe(u => {
      this.user = u;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleDarkMode(): void {
    this.theme.toggle();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 820) {
      this.menuOpen = false;
    }
  }

  goToProfile(): void {
    this.closeMenu();
    this.router.navigate(['/profile/user-details']);
  }

  goToAdmin(): void {
    if (!this.isAdmin) return;
    this.closeMenu();
    this.router.navigate(['/admin/users']);
  }

  logout(): void {
    this.users.logout();
    this.user = null;
    this.closeMenu();
    this.router.navigate(['/profile/login']);
  }

  get isLoggedIn(): boolean {
    return !!this.user;
  }

  get isAdmin(): boolean {
    return !!this.user && (String(this.user.id) === '1' || this.user.role === 'admin');
  }
}