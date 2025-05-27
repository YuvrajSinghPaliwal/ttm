import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription, catchError, of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { Train, TrainSearchResult } from '../../../core/interfaces/train.interface';
import { Booking, BookTicketRequest } from '../../../core/interfaces/booking.interface';
import { User } from '../../../core/interfaces/user.interface';
import { Passenger, PassengerInput } from '../../../core/interfaces/passenger.interface';
// Import Validators
// import { stationNameValidator } from '../../../../Validators/station-name.validator'; // Assuming station names are now from select dropdown
import { futureDateValidator } from '../../../../Validators/future-date.validator';

@Component({
  selector: 'app-book-ticket',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './book-ticket.component.html',
  styleUrls: ['./book-ticket.component.css']
})
export class BookTicketComponent implements OnInit, OnDestroy {
  // --- Injections ---
  private authService = inject(AuthService);
  private dataService = inject(DataService);
  private router = inject(Router);

  // --- Form & State ---
  bookTicketForm!: FormGroup;
  currentUser: User | null = null;
  bookingError: string | null = null;
  bookingSuccess: { message: string; bookingId: number } | null = null;
  isLoadingForm = true;
  isSubmitting = false;

  // --- Route Selection State ---
  availableStations: string[] = []; // List of all unique station names
  foundTrains: TrainSearchResult[] = []; // Use TrainSearchResult interface
  isLoadingStations = true;
  isLoadingTrains = false;
  searchTriggered = false;

  private stationSub: Subscription | null = null;
  private searchSub: Subscription | null = null;
  private bookingSub: Subscription | null = null;

  // --- Lifecycle Hooks ---
  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
        this.bookingError = "User not logged in. Redirecting...";
        setTimeout(() => this.router.navigate(['/login']), 2000);
        return;
    }
    this.loadStations();
    this.initializeForm();
    this.isLoadingForm = false;
  }

  ngOnDestroy(): void {
    this.stationSub?.unsubscribe();
    this.searchSub?.unsubscribe();
    this.bookingSub?.unsubscribe();
  }

  // --- Data Loading ---
  loadStations(): void {
    this.isLoadingStations = true;
    this.stationSub = this.dataService.getAllStationNames()
        .pipe(catchError(err => {
            this.bookingError = `Error loading stations: ${err.message}`;
            this.isLoadingStations = false;
            return of([]); // Return empty array on error
        }))
        .subscribe(stations => {
            this.availableStations = stations;
            this.isLoadingStations = false;
        });
}

  // --- Form Initialization ---
  initializeForm(): void {
    this.bookTicketForm = new FormGroup({
      // User details (pre-filled from auth service)
      userId: new FormControl({ value: this.currentUser?.userId || '', disabled: true }),
      name: new FormControl({ value: this.currentUser?.userName || '', disabled: true }), // Use userName

      // Route Selection
      boardingStation: new FormControl('', [Validators.required]),
      destinationStation: new FormControl('', [Validators.required]),

      // Details Entered AFTER Finding Trains
      selectedTrainNo: new FormControl({ value: '', disabled: true }, [Validators.required]), // Use trainNo for selection
      journeyDate: new FormControl({ value: '', disabled: true }, [Validators.required, futureDateValidator]),
      // Seat type selection is handled by passenger counts now, matching BookTicketRequest
      acSeats: new FormControl({ value: 0, disabled: true }, [Validators.min(0)]),
      slSeats: new FormControl({ value: 0, disabled: true }, [Validators.min(0)]),

      // Passengers FormArray
      passengers: new FormArray<FormGroup>(
         [], // Start empty, add passengers based on seat counts later? Or add first one?
         [Validators.required, Validators.minLength(1)] // Need at least one passenger if seats > 0
       )
    }, { validators: [this.boardingDestinationValidator, this.seatCountValidator] }); // Add cross-field validators

    // Initially disable fields that depend on train selection
    this.toggleTrainDependentFields(false);

    // Add initial passenger row
    this.passengersArray.push(this.createPassengerGroup());
  }

  // --- Form Validators ---
  boardingDestinationValidator(control: AbstractControl): ValidationErrors | null {
    const boarding = control.get('boardingStation');
    const destination = control.get('destinationStation');

    if (boarding && destination && boarding.value && destination.value && boarding.value === destination.value) {
        destination.setErrors({ ...(destination.errors || {}), stationsSame: true });
        return { stationsSame: true };
    }
    // Clear the error if previously set
    if (destination?.hasError('stationsSame')) {
        const { stationsSame, ...restErrors } = destination.errors ?? {};
        destination.setErrors(Object.keys(restErrors).length > 0 ? restErrors : null);
    }
    return null;
  }

  seatCountValidator(control: AbstractControl): ValidationErrors | null {
      const acSeats = control.get('acSeats');
      const slSeats = control.get('slSeats');
      const passengers = control.get('passengers') as FormArray;

      const acCount = acSeats?.value ?? 0;
      const slCount = slSeats?.value ?? 0;
      const totalSeats = acCount + slCount;
      const passengerCount = passengers?.length ?? 0;

      if (totalSeats <= 0) {
          return { noSeatsSelected: true }; // Must select at least one seat type
      }
      
      if (totalSeats > 6) {
        return { seatLimitExceeded: true }; // max seats 6
    }
      if (totalSeats !== passengerCount) {
          return { passengerSeatMismatch: true }; // Number of passengers must match total seats
      }
      return null;
    }


  // Helper to enable/disable fields
  toggleTrainDependentFields(enable: boolean): void {
      const fields = ['selectedTrainNo', 'journeyDate', 'acSeats', 'slSeats'];
      fields.forEach(fieldName => {
          const control = this.bookTicketForm.get(fieldName);
          if (control) {
              if (enable) {
                  control.enable();
              } else {
                  control.disable();
                  // Reset value when disabling, except for train selection maybe?
                  if (fieldName !== 'selectedTrainNo') control.reset('');
              }
          }
      });
       // Enable/disable passenger form based on enable flag
       if(enable) {
           this.passengersArray.enable();
       } else {
           this.passengersArray.disable();
       }
  }

  // Helper to create a FormGroup for a single passenger
  createPassengerGroup(passenger?: Passenger): FormGroup {
     return new FormGroup({
       // id, bookingId, seatNumber are not needed for input
       name: new FormControl(passenger?.name || '', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]), // Allow spaces
       age: new FormControl(passenger?.age || null, [Validators.required, Validators.min(1), Validators.max(120)]),
       gender: new FormControl<'Male'|'Female'|'Other'|''>(passenger?.gender || '', [Validators.required])
     });
  }

  get passengersArray(): FormArray<FormGroup> {
    return this.bookTicketForm.get('passengers') as FormArray<FormGroup>;
  }

  // --- Train Search Logic ---
  findMatchingTrains(): void {
      const boardingControl = this.bookTicketForm.get('boardingStation');
      const destinationControl = this.bookTicketForm.get('destinationStation');
      this.searchTriggered = true;
      this.foundTrains = [];
      this.bookTicketForm.get('selectedTrainNo')?.reset(''); // Clear previous selection
      this.toggleTrainDependentFields(false);
      this.bookingError = null; // Clear previous errors

      boardingControl?.markAsTouched();
      destinationControl?.markAsTouched();
      // Run validators manually
      this.boardingDestinationValidator(this.bookTicketForm);

      if (!boardingControl?.value || !destinationControl?.value || this.bookTicketForm.hasError('stationsSame')) {
          this.bookingError = "Please select valid and different boarding and destination stations.";
          return;
      }

      this.isLoadingTrains = true;
      const boarding = boardingControl.value;
      const destination = destinationControl.value;

      this.searchSub = this.dataService.findTrainsBetweenStations(boarding, destination)
        .pipe(catchError(err => {
            this.bookingError = `Error finding trains: ${err.message}`;
            this.isLoadingTrains = false;
            this.foundTrains = [];
            return of([]); // Continue with empty array
        }))
        .subscribe(trains => {
          this.foundTrains = trains;
          this.isLoadingTrains = false;
          if (this.foundTrains.length > 0) {
              this.toggleTrainDependentFields(true); // Enable fields
          } else {
              this.bookingError = `No direct trains found for the route: ${boarding} to ${destination}.`;
              this.toggleTrainDependentFields(false); // Keep disabled
          }
        });
  }


  // --- Passenger FormArray Manipulation ---
    // Adjust number of passenger forms based on selected AC/SL seats
    onSeatChange(): void {
        const acSeats = this.bookTicketForm.get('acSeats')?.value ?? 0;
        const slSeats = this.bookTicketForm.get('slSeats')?.value ?? 0;
        const totalSeats = acSeats + slSeats;
        const currentPassengers = this.passengersArray.length;

        if (totalSeats < 0) return; // Should be handled by validator min(0)

        if (totalSeats > currentPassengers) {
            // Add new passenger forms
            for (let i = currentPassengers; i < totalSeats; i++) {
                this.passengersArray.push(this.createPassengerGroup());
            }
        } else if (totalSeats < currentPassengers) {
            // Remove excess passenger forms
            for (let i = currentPassengers - 1; i >= totalSeats; i--) {
                this.passengersArray.removeAt(i);
            }
        }
        // Re-validate the form after changing passenger array size
        this.bookTicketForm.updateValueAndValidity();
    }


  // --- Form Submission ---
  onSubmit(): void {
    this.bookingError = null;
    this.bookingSuccess = null;
    this.bookTicketForm.markAllAsTouched(); // Mark all fields

    // Run validators again
    this.boardingDestinationValidator(this.bookTicketForm);
    this.seatCountValidator(this.bookTicketForm);

    if (this.bookTicketForm.invalid) {
        console.log("Form Errors:", this.bookTicketForm.errors);
        console.log("Passenger Array Errors:", this.passengersArray.errors);
        this.passengersArray.controls.forEach((control, index) => {
           if(control.invalid) console.log(`Passenger ${index+1} Errors:`, control.errors);
        });

        this.bookingError = "Please correct the errors in the form. Ensure stations are different, a train is selected, date is valid, seat counts match passenger details.";
        if (this.bookTicketForm.hasError('passengerSeatMismatch')) {
             this.bookingError += " Number of passengers must exactly match the total number of AC + SL seats selected.";
        }
        if (this.bookTicketForm.hasError('seatLimitExceeded')) {
          this.bookingError += " You can book maximum of 6 seats";
     }
        if (this.bookTicketForm.hasError('noSeatsSelected')) {
             this.bookingError += " Select at least one AC or SL seat.";
        }
        return;
    }

    if (!this.currentUser?.userId) {
        this.bookingError = "User session error. Please log in again.";
        return;
    }

    this.isSubmitting = true;
    const formRawValue = this.bookTicketForm.getRawValue();

    // Prepare the request payload for the backend
    const bookingRequest: BookTicketRequest = {
      userId: this.currentUser.userId,
      trainNo: Number(formRawValue.selectedTrainNo),
      date: formRawValue.journeyDate, // Expects YYYY-MM-DD string
      acSeats: Number(formRawValue.acSeats),
      slSeats: Number(formRawValue.slSeats),
      passengers: formRawValue.passengers.map((p: any): PassengerInput => ({
         // Map form values to PassengerInput interface
         name: p.name,
         age: Number(p.age),
         gender: p.gender
      }))
    };

    console.log('Booking Request:', bookingRequest); // For debugging

    // Call the DataService to create the booking
    this.bookingSub = this.dataService.createBooking(bookingRequest)
        .pipe(
            catchError(err => {
                this.bookingError = `Booking failed: ${err.message}`;
                this.isSubmitting = false;
                return throwError(() => err); // Rethrow error
            })
        )
        .subscribe(createdBooking => {
            this.bookingSuccess = {
                message: `Ticket booked successfully! Booking ID: ${createdBooking.bookingId}`,
                bookingId: createdBooking.bookingId
            };
            this.isSubmitting = false;
            this.resetFormAndState(); // Reset form after successful booking
            // Optionally redirect after a delay
            // setTimeout(() => this.router.navigate(['/customer/view-tickets']), 3000);
        });
  }

  resetFormAndState(): void {
    this.foundTrains = [];
    this.searchTriggered = false;
    this.bookingError = null;
    // Don't clear success message immediately
    // this.bookingSuccess = null;
    this.isSubmitting = false;
    this.isLoadingTrains = false;
    // Re-initialize the form to its default state
    this.initializeForm();
  }

  // --- Getters for Template Validation Access ---
  get boardingStation() { return this.bookTicketForm.get('boardingStation'); }
  get destinationStation() { return this.bookTicketForm.get('destinationStation'); }
  get selectedTrainNo() { return this.bookTicketForm.get('selectedTrainNo'); }
  get journeyDate() { return this.bookTicketForm.get('journeyDate'); }
  get acSeats() { return this.bookTicketForm.get('acSeats'); }
  get slSeats() { return this.bookTicketForm.get('slSeats'); }

}