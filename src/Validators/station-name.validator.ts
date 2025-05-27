import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom validator for basic station name format (letters, spaces, dots, hyphens).
 */
export const stationNameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
   if (!control.value) {
      return null; // Don't validate empty values, let 'required' handle it
   }
   // Allows letters (unicode included), numbers, spaces, hyphens, periods, commas, parentheses
   const valid = /^[a-zA-Z0-9\s\.\-\\(\)]+$/u.test(control.value);
   return valid ? null : { invalidStationName: true };
};