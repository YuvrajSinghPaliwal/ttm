// src/app/core/validators/future-date.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom validator to ensure the selected date is not in the past.
 */
export const futureDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) { return null; } // Don't validate empty value

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare date only, ignore time

    const selectedDate = new Date(control.value);

    // Ensure the selected date is valid before comparing
    if (isNaN(selectedDate.getTime())) {
        return { invalidDate: true }; // Handle cases where input might not be a valid date string
    }
    selectedDate.setHours(0, 0, 0, 0); // Also set selected date time to 0 for accurate comparison

    return selectedDate >= today ? null : { dateInPast: true };
};