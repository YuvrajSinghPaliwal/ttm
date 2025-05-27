import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { User } from '../../../core/interfaces/user.interface';
import { Booking } from '../../../core/interfaces/booking.interface'; // Use Booking

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] // Link to your CSS file if needed
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  dataService = inject(DataService);

  currentUser: User | null = null;
  userBookings: Booking[] = []; // Renamed from userTickets
  // Use Map for ticket counts by type <SeatTypeString, PassengerCount>
  ticketCounts: Map<string, number> = new Map<string, number>([['AC', 0], ['SL', 0], ['Total', 0]]);
  isLoading = true;
  error: string | null = null;

  private dataSub: Subscription | null = null;

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue; // Get user from BehaviorSubject
    if (this.currentUser?.userId) {
        this.loadDashboardData(this.currentUser.userId);
    } else {
        this.error = "User not logged in.";
        this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
      this.dataSub?.unsubscribe();
  }

  loadDashboardData(userId: number): void {
    this.isLoading = true;
    this.error = null;

    this.dataSub = this.dataService.getUserBookings(userId)
      .pipe(
        catchError(err => {
          this.error = `Error loading dashboard data: ${err.message}`;
          this.isLoading = false;
          return of([]); // Return empty array on error
        })
      )
      .subscribe(bookings => {
        this.userBookings = bookings;
        this.calculateTicketCounts();
        this.isLoading = false;
      });
  }

  calculateTicketCounts(): void {
     let acPassengerCount = 0;
     let slPassengerCount = 0;
     let totalPassengerCount = 0;

     this.userBookings.forEach((booking) => {
       // Only count passengers from non-cancelled tickets
       if (booking.bookingStatus?.toLowerCase() !== 'cancelled') {
            // Derive passenger count from seatNumbers string
            const seats = booking.seatNumbers?.split(' ') || [];
            let currentAc = 0;
            let currentSl = 0;
            seats.forEach(seat => {
                if (seat.startsWith('AC')) currentAc++;
                else if (seat.startsWith('SL')) currentSl++;
            });
            acPassengerCount += currentAc;
            slPassengerCount += currentSl;
            totalPassengerCount += (currentAc + currentSl);
       }
     });

     // Update the map
     this.ticketCounts.set('AC', acPassengerCount);
     this.ticketCounts.set('SL', slPassengerCount);
     this.ticketCounts.set('Total', totalPassengerCount);
  }
}