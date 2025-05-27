import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; // Keep CommonModule for *ngIf etc.
import { AuthService } from '../../../core/services/auth.service'; // Correct path

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  // Inject AuthService - public makes it accessible in the template directly
  constructor(public authService: AuthService) {}


  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  get isAdminUser(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
    // Navigation is handled within authService.logout()
  }
}