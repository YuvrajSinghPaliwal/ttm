import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom validator function to check if password and confirmPassword fields match.
 * To be used at the FormGroup level.
 */
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
 
  const confirmPassword = control.get('confirmPassword');

  // If controls haven't loaded yet, or values are empty, don't validate
  if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
    return null;
  }

  // Return error if passwords don't match
  return password.value === confirmPassword.value ? null : { passwordsMismatch: true };
};