import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Define base URL for User microservice (use environment variables ideally)
  private readonly USER_API_URL = 'http://localhost:8101';

  // Use BehaviorSubject to track authentication state
  private loggedInUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public loggedInUser$ = this.loggedInUserSubject.asObservable();

  private readonly storageKey = 'loggedInUser';

  constructor() {}

  // --- Error Handling ---
  private handleError(error: HttpErrorResponse) {
    console.error('Auth API Error:', error);
    let errorMessage = 'Authentication failed.';
    if (error.status === 401) {
        errorMessage = 'Invalid credentials.';
    } else if (error.status === 409) {
        errorMessage = 'Email already registered.';
    } else if (error.error && error.error.message) {
        errorMessage = error.error.message; // Use backend message if available
    } else if (error.message) {
        errorMessage = error.message;
    }
    // Return an observable with a user-facing error message
    return throwError(() => new Error(errorMessage));
  }

  // --- Authentication State ---

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.storageKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  private saveUserToStorage(user: User | null): void {
    if (user) {
      // Store only necessary, non-sensitive data
      const { password, ...userDataToStore } = user;
      localStorage.setItem(this.storageKey, JSON.stringify(userDataToStore));
    } else {
      localStorage.removeItem(this.storageKey);
    }
    this.loggedInUserSubject.next(user); // Update BehaviorSubject
  }

  public get currentUserValue(): User | null {
    return this.loggedInUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue; // Check if user object exists
  }

  isAdmin(): boolean {
    // Adjust admin check based on your User model's 'type' or a specific role field if you add one
    // Example: Assuming admin has email 'admin@example.com' or type 'ADMIN'
    const user = this.currentUserValue;
    // Simple check based on known admin email/username - **adjust as needed**
    return !!user && (user.email === 'admin@irctc.com'); // Replace with your actual admin identifier
  }

  // --- API Calls ---

  login(emailInput: string, passwordInput: string): Observable<User> {
    // Admin Check (Client-Side - Less Secure, Backend should ideally handle roles)
    // In a real app, remove client-side admin checks or make them less critical.
    const adminEmail = "admin@irctc.com"; // Use your actual admin identifier
    const adminPass = "Admin@123";
    if (emailInput === adminEmail && passwordInput === adminPass) {
        // Simulate admin user - **Replace with backend role check**
        const adminUser: User = { userId: 0, userName: 'Admin', email: adminEmail, type: 'ADMIN' }; // Example admin structure
        this.saveUserToStorage(adminUser);
        return of(adminUser); // Return as Observable
    }

    // Backend Login
    const loginUrl = `${this.USER_API_URL}/login`;
    // The Java backend expects form data for login, not JSON body
    const body = new HttpParams()
      .set('email', emailInput)
      .set('password', passwordInput);

    // const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    
    // const headers = new HttpHeaders();

    // return this.http.post<User>(loginUrl, body.toString(), { headers: headers })
    return this.http.post<User>(loginUrl, body)

      .pipe(
        tap(user => {
          if (user) {
            this.saveUserToStorage(user);
          } else {
            // Should be caught by handleError, but double check
            this.logout();
          }
        }),
        catchError(this.handleError) // Use centralized error handler
      );
  }

  register(userData: Omit<User, 'userId' | 'type'>): Observable<User> {
      // Add default type if needed, e.g., 'Active' or 'Customer'
      const userToRegister: Omit<User, 'userId'> = {
          ...userData,
          type:'client' // Set default type
      };
      return this.http.post<User>(`${this.USER_API_URL}/registerUser`, userToRegister)
        .pipe(
          tap(registeredUser => {
            // Optionally log in the user automatically after registration
            // this.saveUserToStorage(registeredUser);
            console.log('Registration successful:', registeredUser);
          }),
          catchError(this.handleError) // Use centralized error handler
        );
    }


  logout(): void {
    this.saveUserToStorage(null); // Clear stored user and notify subscribers
    this.router.navigate(['/login']); // Redirect to login page
  }
}