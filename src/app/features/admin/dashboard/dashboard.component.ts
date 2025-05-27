import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataService } from '../../../core/services/data.service';
import { User } from '../../../core/interfaces/user.interface';
import { Train } from '../../../core/interfaces/train.interface';
import { Booking } from '../../../core/interfaces/booking.interface'; // Use Booking

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, KeyValuePipe], // KeyValuePipe for sales summary map
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  dataService = inject(DataService);

 
  salesSummary: Map<string, number> = new Map<string, number>();
  totalPassengersBooked = 0;
  isLoadingSales = true;
  salesError: string | null = null;

  // Users Snippet State
  usersSnippet: User[] = [];
  totalUsers = 0;
  isLoadingUsers = true;
  usersError: string | null = null;

  // Trains Snippet State
  trainsSnippet: Train[] = [];
  totalTrains = 0;
  isLoadingTrains = true;
  trainsError: string | null = null;

  private snippetSize = 3; // Configurable snippet size
  private subs: Subscription[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
      this.subs.forEach(sub => sub.unsubscribe());
  }

  loadDashboardData(): void {
    this.isLoadingSales = true;
    this.isLoadingUsers = true;
    this.isLoadingTrains = true;
    this.salesError = null;
    this.usersError = null;
    this.trainsError = null;

    // Use forkJoin to run requests in parallel
    const joinedSub = forkJoin({
      bookings: this.dataService.getBookings().pipe(catchError(err => {
          this.salesError = `Error loading bookings: ${err.message}`;
          this.isLoadingSales = false; // Set loading false on error too
          return of([]); // Return empty array on error
      })),
      users: this.dataService.getAllUsers().pipe(catchError(err => {
          this.usersError = `Error loading users: ${err.message}`;
          this.isLoadingUsers = false;
          return of([]);
      })),
      trains: this.dataService.getTrains().pipe(catchError(err => {
          this.trainsError = `Error loading trains: ${err.message}`;
          this.isLoadingTrains = false;
          return of([]);
      }))
    }).subscribe(({ bookings, users, trains }) => {
      // Process Sales Summary
      this.calculateSalesSummary(bookings);
      this.isLoadingSales = false;

      // Process Users Snippet
      this.totalUsers = users.length; // Count all users fetched
      
      this.usersSnippet = users // or nonAdminUsers
                            .sort((a, b) => (a.userName || '').localeCompare(b.userName || ''))
                            .slice(0, this.snippetSize);
      this.isLoadingUsers = false;

      // Process Trains Snippet
      this.totalTrains = trains.length;
      this.trainsSnippet = trains
                             .sort((a, b) => (a.trainName || '').localeCompare(b.trainName || ''))
                             .slice(0, this.snippetSize);
      this.isLoadingTrains = false;
    });
    this.subs.push(joinedSub);
  }

  calculateSalesSummary(bookings: Booking[]): void {
      let acCount = 0;
      let slCount = 0;
      let total = 0;

      bookings.forEach(booking => {
          // Only count passengers from non-cancelled tickets
          if (booking.bookingStatus?.toLowerCase() !== 'cancelled') {
              
              const seats = booking.seatNumbers?.split(' ') || [];
              let currentAc = 0;
              let currentSl = 0;
              seats.forEach(seat => {
                  if (seat.startsWith('AC')) currentAc++;
                  else if (seat.startsWith('SL')) currentSl++;
              });
              acCount += currentAc;
              slCount += currentSl;
              total += (currentAc + currentSl);
          }
      });

      this.salesSummary.set('AC', acCount);
      this.salesSummary.set('SL', slCount);
      this.totalPassengersBooked = total;
  }

  // Helper function for template - DRY principle
  getOrigin(train: Train): string {
      return train.originStation || 'N/A';
  }

  // Helper function for template - DRY principle
  getDestination(train: Train): string {
      return train.destinationStation || 'N/A';
  }
}