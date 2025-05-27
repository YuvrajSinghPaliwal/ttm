import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidationErrors, FormBuilder } from '@angular/forms';
import { Subscription, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataService } from '../../../core/services/data.service';
import { Train, RouteSegment } from '../../../core/interfaces/train.interface';
import { stationNameValidator } from '../../../../Validators/station-name.validator';

@Component({
  selector: 'app-manage-trains',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './manage-trains.component.html',
  styleUrls: ['./manage-trains.component.css']
})
export class ManageTrainsComponent implements OnInit, OnDestroy {
  // --- Injections ---
  dataService = inject(DataService);
  private fb = inject(FormBuilder);

  // --- Component State ---
  trains: Train[] = [];
  isLoading = true;
  error: string | null = null;
  actionError: string | null = null;
  isSubmitting = false;
  showAddTrainForm = false;

  // Modals State
  selectedTrain: Train | null = null;
  showUpdateModal = false;
  showRouteModal = false;
  showDeleteConfirmModal = false;
  trainToDelete: Train | null = null;

  // --- Forms ---
  addTrainForm!: FormGroup;
  updateTrainForm!: FormGroup;
  manageRouteForm!: FormGroup;

  private subs: Subscription[] = [];

  ngOnInit(): void {
    this.loadTrains();
    this.initializeAddTrainForm();
   
  }

  ngOnDestroy(): void {
      this.subs.forEach(sub => sub.unsubscribe());
  }

  
  loadTrains(): void {
    this.isLoading = true;
    this.error = null;
    const sub = this.dataService.getTrains()
        .pipe(catchError(err => {
            this.error = `Error loading trains: ${err.message}`;
            this.isLoading = false;
            return of([]);
        }))
        .subscribe(trains => {
            this.trains = trains.sort((a, b) => (a.trainNo || 0) - (b.trainNo || 0));
            this.isLoading = false;
        });
    this.subs.push(sub);
  }

  initializeAddTrainForm(): void {
      this.addTrainForm = this.fb.group({
          trainNo: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
          trainName: ['', [Validators.required, Validators.minLength(3)]],
          originStation: ['', [Validators.required, stationNameValidator]],
          destinationStation: ['', [Validators.required, stationNameValidator]],
          departureTime: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
          arrivalTime: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
          distance: [null, [Validators.required, Validators.min(1)]],
          totalAcSeats: [0, [Validators.required, Validators.min(0)]],
          totalSleeperSeats: [0, [Validators.required, Validators.min(0)]],
      }, { validators: this.originDestinationValidator });
  }

  originDestinationValidator(control: AbstractControl): ValidationErrors | null {
      const origin = control.get('originStation');
      const destination = control.get('destinationStation');
      if (origin && destination && origin.value && destination.value && origin.value.trim().toLowerCase() === destination.value.trim().toLowerCase()) {
             destination.setErrors({ ...destination.errors, stationsSame: true });
            return { stationsSame: true };
        }
        if(destination?.hasError('stationsSame') && !(origin && destination && origin.value && destination.value && origin.value.trim().toLowerCase() === destination.value.trim().toLowerCase())){
            const { stationsSame, ...restErrors } = destination.errors ?? {};
            destination.setErrors(Object.keys(restErrors).length > 0 ? restErrors : null);
        }
        return null;
  };

  submitAddTrain(): void {
    this.addTrainForm.markAllAsTouched();
    this.originDestinationValidator(this.addTrainForm);
    this.actionError = null;

    if (this.addTrainForm.invalid) {
      this.actionError = 'Please correct the errors in the Add Train form.';
      return;
    }
    this.isSubmitting = true;
    const formValue = this.addTrainForm.value;
    const newTrainData: Omit<Train, 'trainId' | 'availableAcSeats' | 'availableSleeperSeats'> = {
        trainNo: Number(formValue.trainNo),
        trainName: formValue.trainName,
        originStation: formValue.originStation.trim(),
        destinationStation: formValue.destinationStation.trim(),
        departureTime: formValue.departureTime,
        arrivalTime: formValue.arrivalTime,
        distance: Number(formValue.distance),
        totalAcSeats: Number(formValue.totalAcSeats),
        totalSleeperSeats: Number(formValue.totalSleeperSeats),
    };
    const sub = this.dataService.saveTrain(newTrainData as Train)
        .pipe(catchError(err => {
            this.actionError = `Error adding train: ${err.error?.message || err.message}`;
            this.isSubmitting = false;
            return throwError(() => err);
        }))
        .subscribe((savedTrain: Train) => {
            alert(`Train ${savedTrain.trainName} (${savedTrain.trainNo}) added successfully!`);
            this.showAddTrainForm = false;
            this.addTrainForm.reset();
            this.isSubmitting = false;
            this.loadTrains();
        });
    this.subs.push(sub);
  }
  openDeleteConfirmModal(train: Train): void {
    this.trainToDelete = train;
    this.showDeleteConfirmModal = true;
    this.actionError = null;
  }
  closeDeleteConfirmModal(): void {
    this.showDeleteConfirmModal = false;
    this.trainToDelete = null;
  }
  confirmAndDeleteTrain(): void {
    if (!this.trainToDelete || this.trainToDelete.trainId === undefined) return;
    this.isSubmitting = true;
    this.actionError = null;
    const trainId = this.trainToDelete.trainId;
    const sub = this.dataService.deleteTrain(trainId)
      .pipe(catchError(err => {
            this.actionError = `Error deleting train: ${err.error?.message || err.message}`;
            this.isSubmitting = false;
            this.closeDeleteConfirmModal();
            return throwError(() => err);
       }))
      .subscribe(() => {
          alert(`Train ${this.trainToDelete?.trainName} (${this.trainToDelete?.trainNo}) deleted successfully.`);
          this.isSubmitting = false;
          this.closeDeleteConfirmModal();
          this.loadTrains();
      });
    this.subs.push(sub);
  }
  openUpdateModal(train: Train): void {
    this.selectedTrain = { ...train };
    this.actionError = null;
    this.updateTrainForm = this.fb.group({
        trainId: [{ value: this.selectedTrain.trainId, disabled: true }],
        trainNo: [{ value: this.selectedTrain.trainNo, disabled: true }],
        trainName: [this.selectedTrain.trainName, [Validators.required, Validators.minLength(3)]],
        originStation: [{ value: this.selectedTrain.originStation, disabled: true }],
        destinationStation: [{ value: this.selectedTrain.destinationStation, disabled: true }],
        departureTime: [this.selectedTrain.departureTime, [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
        arrivalTime: [this.selectedTrain.arrivalTime, [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
        distance: [this.selectedTrain.distance, [Validators.required, Validators.min(1)]],
        totalAcSeats: [this.selectedTrain.totalAcSeats, [Validators.required, Validators.min(0)]],
        availableAcSeats: [this.selectedTrain.availableAcSeats, [Validators.required, Validators.min(0)]],
        totalSleeperSeats: [this.selectedTrain.totalSleeperSeats, [Validators.required, Validators.min(0)]],
        availableSleeperSeats: [this.selectedTrain.availableSleeperSeats, [Validators.required, Validators.min(0)]],
    });
    this.showUpdateModal = true;
  }
  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedTrain = null;
  }
  saveTrainUpdate(): void {
    if (!this.selectedTrain || !this.updateTrainForm) return;
    this.updateTrainForm.markAllAsTouched();
    this.actionError = null;
    if (this.updateTrainForm.invalid) {
      this.actionError = 'Please correct the errors in the Update Train form.';
      return;
    }
    this.isSubmitting = true;
    const formValue = this.updateTrainForm.getRawValue();
    const updatedTrainData: Train = {
       trainId: formValue.trainId, trainNo: formValue.trainNo, trainName: formValue.trainName,
       originStation: formValue.originStation, destinationStation: formValue.destinationStation,
       departureTime: formValue.departureTime, arrivalTime: formValue.arrivalTime,
       distance: Number(formValue.distance), totalAcSeats: Number(formValue.totalAcSeats),
       availableAcSeats: Number(formValue.availableAcSeats), totalSleeperSeats: Number(formValue.totalSleeperSeats),
       availableSleeperSeats: Number(formValue.availableSleeperSeats),
    };
    const sub = this.dataService.updateTrain(updatedTrainData)
        .pipe(catchError(err => {
            this.actionError = `Error updating train: ${err.error?.message || err.message}`;
            this.isSubmitting = false;
            return throwError(() => err);
        }))
        .subscribe((updatedTrain: Train) => {
            alert(`Train ${updatedTrain.trainNo} details updated successfully!`);
            this.isSubmitting = false;
            this.closeUpdateModal();
            this.loadTrains();
        });
    this.subs.push(sub);
  }


  // --- Manage Train Route Modal (INTERMEDIATE STOPS ONLY) ---
  openRouteModal(train: Train): void {
    this.selectedTrain = { ...train };
    this.actionError = null;
    this.isSubmitting = false;

  

  
    
    this.manageRouteForm = this.fb.group({
      routeId:0 ,
      trainNo: ['', [Validators.required]],
      station: ['', [Validators.required]], // Renamed from stationName for consistency? Check Java
      stopNumber: ['', [Validators.required]],
      arrivalTime:  ['', [Validators.required]],// Optional
      departureTime:  ['', [Validators.required]], // Optional
      distanceFromSource:  ['', [Validators.required]]
    });
    this.showRouteModal = true;
  }

  

  closeRouteModal(): void {
    this.showRouteModal = false;
    this.selectedTrain = null;
    this.actionError = null;
    if (this.manageRouteForm) { 
       
        this.manageRouteForm.reset(); // Reset overall form state
    }
  }

  
  saveRouteUpdate(): void {
    console.log("we are in saveRoute");
    if (!this.selectedTrain || !this.manageRouteForm) {
        this.actionError = "Cannot save route: No train selected or form not initialized.";
        return;
    }
    
    
    this.manageRouteForm.markAllAsTouched();
    this.actionError = null;
    if (this.manageRouteForm.invalid) {
        this.actionError = "Please correct the errors in the route form. All fields for intermediate stops are required.";
        return;
    }
    this.isSubmitting = true;
    
    

    const formValue = this.manageRouteForm.value;
    const trainRoutes: RouteSegment = {
      routeId:0 ,
      trainNo: formValue.trainNo,
      station: formValue.station, // Renamed from stationName for consistency? Check Java
      stopNumber:  formValue.stopNumber,
      arrivalTime:  formValue.arrivalTime,// Optional
      departureTime:  formValue.arrivalTime, // Optional
      distanceFromSource:  formValue.distanceFromSource,
    };
    
    const sub = this.dataService.saveTrainRoutes(trainRoutes)
    .pipe(catchError((err: any) => {
        this.actionError = `Error saving route: ${err.error?.message || err.message}`;
        this.isSubmitting = false;
        return throwError(() => err);
    }))
    .subscribe(() => {
        alert(`Intermediate route for train ${this.selectedTrain?.trainNo} updated successfully!`);
        this.isSubmitting = false;
        this.closeRouteModal();
    });
   
    this.subs.push(sub);
    
  }
}
