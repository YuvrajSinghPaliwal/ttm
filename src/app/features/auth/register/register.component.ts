import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { passwordMatchValidator } from '../../../../Validators/password-match.validator';
import { User } from '../../../core/interfaces/user.interface'; // Import User interface

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  registrationError: string | null = null;
  registrationSuccess: string | null = null; // Simplified success message
  isLoading = false;
  

  private authService = inject(AuthService);
  private router = inject(Router);
  private regSub: Subscription | null = null;

  // Password visibility toggles
  inputType: string = 'password';
  inputTypeConfirm: string = 'password';

  ngOnInit(): void {
    const emailValidationRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    this.registerForm = new FormGroup({
      userName: new FormControl('', [ // Changed from username to userName
        Validators.required,
        Validators.minLength(5), // Adjusted minLength
        Validators.pattern(/^[a-zA-Z]+$/),
        
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    
     
   

// (In your FormGroup definition)
email: new FormControl('', [
  Validators.required,
  Validators.pattern(emailValidationRegex) // This regex checks format AND TLD length
]),
   
      contact: new FormControl('', [ // Changed from mobile to contact
          Validators.required,
          Validators.pattern(/^(?!.*(\d)\1{4,})[7-9][0-9]{9}$/) // Assuming Indian mobile numbers
      ]),
      address: new FormControl('', [Validators.required, Validators.minLength(5)]) // Added address field
      
    }, { validators: passwordMatchValidator });
  }

  ngOnDestroy(): void {
    this.regSub?.unsubscribe();
  }

  onSubmit(): void {
    this.registrationError = null;
    this.registrationSuccess = null;

    if (this.registerForm.invalid) {
       this.registerForm.markAllAsTouched();
       return;
    }

    this.isLoading = true;
    
    const { confirmPassword, ...userData } = this.registerForm.value;

    
    const registrationData: Omit<User, 'userId' | 'type'> = {
        userName: userData.userName,
        password: userData.password,
        email: userData.email,
        contact: userData.contact,
        address: userData.address
        // 'type' is handled by AuthService or backend
    };


    this.regSub = this.authService.register(registrationData).subscribe({
        next: (registeredUser) => {
            this.isLoading = false;
            // Backend returns the created User object
            this.registrationSuccess = `Registration successful for ${registeredUser.userName}! Redirecting to login...`;
            this.registerForm.reset();
            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 3000);
        },
        error: (err) => {
            this.isLoading = false;
            this.registrationError = err.message || "An error occurred during registration.";
        }
     });
  }

  togglePasswordVisibility() {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(){
    this.inputTypeConfirm = this.inputTypeConfirm === 'password' ? 'text' : 'password';
  }

  // Helper getters for template validation
  get userName() { return this.registerForm.get('userName'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get email() { return this.registerForm.get('email'); }
  get contact() { return this.registerForm.get('contact'); }
  get address() { return this.registerForm.get('address'); }
}