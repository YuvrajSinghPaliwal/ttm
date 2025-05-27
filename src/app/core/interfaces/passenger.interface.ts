export interface Passenger {
  id?: number; // Optional from backend Passenger entity
  bookingId?: number; // Optional, relevant when fetching existing passengers
  seatNumber?: string; // Optional, assigned during booking
  name: string;
  age: number; // Java int maps to number
  gender: 'Male' | 'Female' | 'Other'; // Use specific string literals
}

// Interface for Passenger data sent *to* the backend during booking
// Matches com.tcs.Booking.model.PassengerDTO
export interface PassengerInput {
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
}