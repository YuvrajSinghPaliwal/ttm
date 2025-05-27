import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataService } from '../../../core/services/data.service';
import { AuthService } from '../../../core/services/auth.service'; // Needed to exclude current admin maybe?
import { User } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit, OnDestroy {
  dataService = inject(DataService);
  authService = inject(AuthService); // Inject AuthService

  users: User[] = [];
  isLoading = true;
  error: string | null = null;
  actionError: string | null = null; // For update/delete errors
  isSubmitting = false;

  // State for Update Modal
  showUpdateUserModal = false;
  selectedUser: User | null = null;
  updateUserForm!: FormGroup;
  showPassword = false; // For password visibility toggle

  // State for Delete Confirmation Modal
  showDeleteConfirmModal = false;
  userToDelete: User | null = null;

  private subs: Subscription[] = [];

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
      this.subs.forEach(sub => sub.unsubscribe());
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    const currentAdmin = this.authService.currentUserValue; // Get current admin

    const sub = this.dataService.getAllUsers()
        .pipe(catchError(err => {
            this.error = `Error loading users: ${err.message}`;
            this.isLoading = false;
            return of([]);
        }))
        .subscribe(users => {
            // Filter out the currently logged-in admin if desired
            this.users = users
                // .filter(user => user.userId !== currentAdmin?.userId) // Example filter
                .sort((a, b) => (a.userName || '').localeCompare(b.userName || ''));
            this.isLoading = false;
        });
    this.subs.push(sub);
  }

  // --- Delete User ---
  openDeleteConfirmModal(user: User): void {
    this.userToDelete = user;
    this.showDeleteConfirmModal = true;
    this.actionError = null;
  }

  closeDeleteConfirmModal(): void {
    this.showDeleteConfirmModal = false;
    this.userToDelete = null;
  }

  confirmAndDeleteUser(): void {
    if (!this.userToDelete) return;

    // Prevent deleting the currently logged-in admin (important!)
    if (this.userToDelete.userId === this.authService.currentUserValue?.userId) {
        alert("You cannot delete your own admin account.");
        this.closeDeleteConfirmModal();
        return;
    }


    this.isSubmitting = true;
    this.actionError = null;
    const userIdToDelete = this.userToDelete.userId;

    // Call DataService method (needs to be implemented in DataService and backend)
    const sub = this.dataService.deleteUser(userIdToDelete)
        .pipe(catchError(err => {
            this.actionError = `Error deleting user: ${err.message}`;
            this.isSubmitting = false;
            this.closeDeleteConfirmModal();
            return throwError(() => err); // Rethrow
         }))
        .subscribe(() => {
            alert(`User ${this.userToDelete?.userName} deleted successfully!`);
            this.isSubmitting = false;
            this.closeDeleteConfirmModal();
            this.loadUsers(); // Refresh list
        });
    this.subs.push(sub);

    // --- Placeholder ---
    //  console.warn(`Deletion for user ${userIdToDelete} requested. Backend endpoint needed.`);
     this.isSubmitting = false;
     // Close modal even if backend isn't ready yet for demo purposes
     this.closeDeleteConfirmModal();
     // --- End Placeholder ---
  }

  // --- Update User Modal Logic ---
  openUpdateUserModal(user: User): void {
    this.selectedUser = { ...user }; // Use a copy
    this.actionError = null;
    this.showPassword = false; // Reset password visibility

    this.updateUserForm = new FormGroup({
      userId: new FormControl({ value: this.selectedUser.userId, disabled: true }),
      userName: new FormControl(this.selectedUser.userName, [Validators.required, Validators.minLength(3)]),
      email: new FormControl(this.selectedUser.email, [Validators.required, Validators.email]),
      // Password is optional for update - only validate if filled
      password: new FormControl('', [
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]),
      contact: new FormControl(this.selectedUser.contact || '', [
        Validators.required,
        Validators.pattern(/^(?!.*(\d)\1{4,})[7-9][0-9]{9}$/)
      ]),
      address: new FormControl(this.selectedUser.address || '', [Validators.required, Validators.minLength(5)]),
      // Add 'type' or 'status' if it's editable by admin
      type: new FormControl(this.selectedUser.type || 'client') // Example: Make status editable
    });
    this.showUpdateUserModal = true;
  }

  closeUpdateUserModal(): void {
      this.showUpdateUserModal = false;
      this.selectedUser = null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  saveUserUpdate(): void {
    if (!this.selectedUser || !this.updateUserForm) return;
    this.updateUserForm.markAllAsTouched();
    this.actionError = null;

    // Check password validity *only if* a new password was entered
    const passwordControl = this.updateUserForm.get('password');
    if (passwordControl?.value && passwordControl?.invalid) {
        this.actionError = 'New password does not meet complexity requirements.';
        return;
    }

    if (this.updateUserForm.invalid) {
         this.actionError = 'Please correct the errors in the form.';
         return;
    }

    this.isSubmitting = true;
    const formRawValue = this.updateUserForm.getRawValue();
    // Construct user data for update
    const userDataToUpdate: User = {
       userId: this.selectedUser.userId, // PK needed for update
       userName: formRawValue.userName,
       email: formRawValue.email,
       contact: formRawValue.contact,
       address: formRawValue.address,
       type: formRawValue.type,
       // Only include password if a new one was entered
       password: formRawValue.password ? formRawValue.password : undefined // Send undefined if not changing
    };
    console.log(userDataToUpdate);

    // Remove password field if it's empty/undefined before sending to backend,
    // unless the backend handles null/empty password as "no change"
    if (!userDataToUpdate.password) {
        delete userDataToUpdate.password;
    }

    // Call DataService method (needs to be implemented in DataService and backend)
    const sub = this.dataService.updateUser(userDataToUpdate)
        .pipe(catchError(err => {
            this.actionError = `Error updating user: ${err.message}`;
            this.isSubmitting = false;
            return throwError(() => err); // Rethrow
         }))
        .subscribe(updatedUser => {
            alert(`User ${updatedUser.userName} updated successfully!`);
            this.isSubmitting = false;
            this.closeUpdateUserModal();
            this.loadUsers(); // Refresh list
        });
    this.subs.push(sub);

     // --- Placeholder ---
     console.warn(`Update for user ${userDataToUpdate.userId} requested. Backend endpoint needed.`);
     console.log("Data to send:", userDataToUpdate);
    //  alert(`User update functionality requires a backend implementation.`);
     this.isSubmitting = false;
     // Close modal even if backend isn't ready yet for demo purposes
     this.closeUpdateUserModal();
     // --- End Placeholder ---
  }

}