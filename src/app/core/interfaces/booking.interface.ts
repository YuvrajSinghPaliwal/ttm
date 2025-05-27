// src/app/core/interfaces/booking.interface.ts
// Matches com.tcs.Booking.model.Booking
import { Passenger, PassengerInput } from './passenger.interface';
import { User } from './user.interface';

export interface Booking {
  bookingId: number;
  userId: number;
  trainNo: number;
  trainName: string;
  fromStation: string;
  toStation: string;
  startTime: string;
  endTime: string;
  journeyDate: string; // Keep as string YYYY-MM-DD or ISO format
  seatNumbers: string; // e.g., "AC1 SL5 SL6"
  bookingDate: string; // Keep as string YYYY-MM-DD or ISO format
  price: number;
  bookingStatus: 'Confirmed' | 'Cancelled' | string; // Allow known statuses + others

  // These might be loaded separately or included by backend DTOs
  passengers?: Passenger[];
  user?: User; // Booker details
}

// Interface for the request body when booking a ticket
// Matches com.tcs.Booking.DTO.BookTicketRequest
export interface BookTicketRequest {
    userId: number;
    trainNo: number;
    date: string; // Journey date YYYY-MM-DD
    acSeats: number;
    slSeats: number;
    passengers: PassengerInput[];
}