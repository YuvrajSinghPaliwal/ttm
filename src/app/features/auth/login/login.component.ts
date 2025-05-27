import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule, RouterLink, CommonModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loginError: string | null = null;
  loginSuccess: string | null = null;
  isLoading = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private loginSub: Subscription | null = null;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      // Use email based on updated AuthService and Java backend
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
  }

  onSubmit(): void {
    this.loginError = null;
    this.loginSuccess = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.loginSub = this.authService.login(email, password).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.loginSuccess = "Login successful! Redirecting...";
        console.log(this.loginSuccess);
        // Redirect based on user type/role (isAdmin check in AuthService)
        setTimeout(() => {
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/customer']);
          }
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.loginError = err.message || "An error occurred during login."; // Use error message from service
      }
    });
  }
}