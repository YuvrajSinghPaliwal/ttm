import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { Booking } from '../../../core/interfaces/booking.interface'; // Use Booking interface
import { User } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-view-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view-tickets.component.html',
  styleUrls: ['./view-tickets.component.css']
})
export class ViewTicketsComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  dataService = inject(DataService);

  currentUser: User | null = null;
  userBookings: Booking[] = []; // Renamed from userTickets to userBookings
  isLoading = true;
  error: string | null = null;

  // State for Cancel Confirmation Modal
  showCancelConfirm = false;
  bookingToCancel: Booking | null = null; // Store the whole booking object
  isCancelling = false;
  cancelError: string | null = null;

  private bookingsSub: Subscription | null = null;
  private cancelSub: Subscription | null = null;

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser?.userId) {
        this.loadBookings(this.currentUser.userId);
    } else {
        this.error = "User not logged in.";
        this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
      this.bookingsSub?.unsubscribe();
      this.cancelSub?.unsubscribe();
  }

  loadBookings(userId: number): void {
    this.isLoading = true;
    this.error = null;
    this.bookingsSub = this.dataService.getUserBookings(userId)
      .pipe(
        catchError(err => {
          this.error = `Error loading bookings: ${err.message}`;
          this.isLoading = false;
          return of([]); // Return empty array on error
        })
      )
      .subscribe(bookings => {
        // Process bookings if needed (e.g., sorting, ensuring fields)
        this.userBookings = bookings.map(booking => ({
            ...booking,
            // Ensure default values if necessary, though backend should provide them
            passengers: booking.passengers ?? [],
            bookingStatus: booking.bookingStatus ?? 'Unknown'
          }))
          .sort((a, b) => (b.journeyDate || '').localeCompare(a.journeyDate || '')); // Sort by date descending
        this.isLoading = false;
      });
  }

  // Open the confirmation modal
  openCancelConfirmModal(booking: Booking): void {
     this.bookingToCancel = booking;
     this.cancelError = null; // Clear previous cancel error
     this.showCancelConfirm = true;
  }

  // Close the confirmation modal
  closeCancelConfirmModal(): void {
     this.showCancelConfirm = false;
     this.bookingToCancel = null;
     this.isCancelling = false;
     this.cancelError = null;
  }

  // Proceed with cancellation after confirmation
  confirmAndCancelBooking(): void {
    
     if (!this.bookingToCancel) return;

     this.isCancelling = true;
     this.cancelError = null;
     const bookingId = this.bookingToCancel.bookingId; 
     this.cancelSub = this.dataService.cancelBooking(bookingId)
      .pipe(catchError(err => {
          this.cancelError = `Failed to cancel booking ${bookingId}: ${err.message}`;
          this.isCancelling = false;
          return of(null); // Handle error locally
      }))
      .subscribe(response => {
          if (response !== null) { // Check if cancellation was successful
              alert(`Booking ${bookingId} has been cancelled.`);
              // Refresh the list after successful cancellation
              if (this.currentUser?.userId) {
                  this.loadBookings(this.currentUser.userId);
              }
              this.closeCancelConfirmModal(); // Close modal
          }
          // Error already handled in catchError if response is null
      });

     // --- Placeholder ---
     console.warn(`Cancellation for booking ${bookingId} requested. Backend endpoint needed.`);
     
     this.isCancelling = false;
     // Close modal even if backend isn't ready yet for demo purposes
     this.closeCancelConfirmModal();
     // --- End Placeholder ---
  }
}