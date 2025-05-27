import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Train, TrainSearchResult, RouteSegment } from '../interfaces/train.interface';
import { Booking, BookTicketRequest } from '../interfaces/booking.interface';
import { User } from '../interfaces/user.interface';
import { Passenger } from '../interfaces/passenger.interface'; // Assuming Passenger interface exists

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);

  // Define base URLs for your microservices (use environment variables ideally)
  private readonly USER_API_URL = 'http://localhost:8101'; // User Service Port
  private readonly BOOKING_API_URL = 'http://localhost:8100'; // Booking Service Port
  private readonly ADMIN_API_URL = 'http://localhost:8102'; // Admin Service Port

  constructor() {}

  // --- Error Handling ---
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
       // Try to get more specific message from backend response body if available
       if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage += `\nDetails: ${error.error.message}`;
       } else if (typeof error.error === 'string') {
         errorMessage += `\nDetails: ${error.error}`;
       }
    }
    return throwError(() => new Error(errorMessage));
  }

  // --- Train Methods (Admin Service) ---

  getTrains(): Observable<Train[]> {
    return this.http.get<Train[]>(`${this.ADMIN_API_URL}/getTrains`)
      .pipe(catchError(this.handleError));
  }

  getTrainById(id: number): Observable<Train> {
    return this.http.get<Train>(`${this.ADMIN_API_URL}/getTrain/${id}`)
      .pipe(catchError(this.handleError));
  }

  getTrainByNo(trainNo: number): Observable<Train> {
    return this.http.get<Train>(`${this.ADMIN_API_URL}/getTrainByNo/${trainNo}`)
      .pipe(catchError(this.handleError));
  }

  findTrainsBetweenStations(origin: string, destination: string): Observable<TrainSearchResult[]> {
    const params = new HttpParams()
      .set('source', origin)
      .set('destination', destination);

    return this.http.get<any[]>(`${this.ADMIN_API_URL}/getTrainsBetween`, { params })
      .pipe(
        map(results => results.map(item => ({
          trainId: item[0],
          trainNo: item[1],
          trainName: item[2],
          originStation: item[3],
          destinationStation: item[4],
          originArrivalTime: item[5],
          destinationArrivalTime: item[6],
          totalAcSeats: item[7],
          availableAcSeats: item[8],
          totalSleeperSeats: item[9],
          availableSleeperSeats: item[10],
        })) as TrainSearchResult[]),
        catchError(this.handleError)
      );
  }

  //giving all distinct names of all station from backend
  getAllStationNames(): Observable<string[]> {
     // Assuming backend endpoint GET /getAllStationNames exists in Admin service
     return this.http.get<string[]>(`${this.ADMIN_API_URL}/getAllStationNames`)
         .pipe(catchError(this.handleError));
     // Fallback implementation if endpoint doesn't exist:
     
     console.warn('getAllStationNames using fallback derived from getTrains(). Backend endpoint preferred.');
     return this.getTrains().pipe(
        map(trains => {
            const stationSet = new Set<string>();
            trains.forEach(train => {
                if (train.originStation) stationSet.add(train.originStation.trim());
                if (train.destinationStation) stationSet.add(train.destinationStation.trim());
            });
            return Array.from(stationSet).sort((a, b) => a.localeCompare(b));
        }),
        catchError(this.handleError)
     )
     
  }

  loadStations(): Observable<string[]> {
    // Assuming backend endpoint GET /getAllStationNames exists in Admin service
    return this.http.get<string[]>(`${this.ADMIN_API_URL}/getAllStationNames`)
        .pipe(catchError(this.handleError));
    
 }

  saveTrain(newTrain: Omit<Train, 'trainId'>): Observable<Train> {
    return this.http.post<Train>(`${this.ADMIN_API_URL}/saveTrain`, newTrain)
      .pipe(catchError(this.handleError));
  }

  updateTrain(updatedTrain: Train): Observable<Train> {
    // Backend expects the full Train object for update
    return this.http.put<Train>(`${this.ADMIN_API_URL}/updateTrain`, updatedTrain)
       .pipe(catchError(this.handleError));
  }

  deleteTrain(trainId: number): Observable<void> {
     return this.http.delete<void>(`${this.ADMIN_API_URL}/deleteTrain/${trainId}`)
       .pipe(catchError(this.handleError));
  }

  // --- Train Route Methods (Admin Service) ---
  /**
   * Saves or updates the route segments for a train.
   */
  saveTrainRoutes(trainRoute: RouteSegment): Observable<RouteSegment> {
    return this.http.post<RouteSegment>(`${this.ADMIN_API_URL}/updateTrainRoute`, trainRoute)
        .pipe(catchError(this.handleError));
  }



  // --- Booking Methods (Booking Service) ---

  getBookings(): Observable<Booking[]> {
      return this.http.get<Booking[]>(`${this.BOOKING_API_URL}/getBookings`)
          .pipe(catchError(this.handleError));
  }

  getBookingById(id: number): Observable<Booking> {
      return this.http.get<Booking>(`${this.BOOKING_API_URL}/getBooking/${id}`)
          .pipe(catchError(this.handleError));
  }

  getUserBookings(userId: number): Observable<Booking[]> {
     return this.http.get<{ bookings: Booking[] }>(`${this.BOOKING_API_URL}/getAllBookingsOfUser/${userId}`)
        .pipe(
            map(response => response.bookings || []),
            catchError(this.handleError)
        );
  }

  createBooking(bookingRequest: BookTicketRequest): Observable<Booking> {
    return this.http.post<Booking>(`${this.BOOKING_API_URL}/bookTicket`, bookingRequest)
      .pipe(catchError(this.handleError));
  }

  /**
   * Cancels a specific booking.
  
   */
  cancelBooking(bookingId: number): Observable<Booking> {
      // Adjust HTTP method (PUT, POST, DELETE) and expected return type based on backend implementation
      return this.http.post<Booking>(`${this.BOOKING_API_URL}/cancelBooking/${bookingId}`, {}) // Empty body for PUT if no data needed
          .pipe(catchError(this.handleError));
  }

  // --- User Methods (User Service) ---

  // Fetches all users - Call User service directly
  getAllUsers(): Observable<User[]> {
     return this.http.get<User[]>(`${this.USER_API_URL}/getUsers`)
       .pipe(catchError(this.handleError));
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.USER_API_URL}/getUserById/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Updates user details.
   */
  updateUser(updatedUser: User): Observable<User> {
      // Backend needs the userId to identify which user to update
      if (!updatedUser.userId) {
        return throwError(() => new Error('User ID is required for update.'));
      }
      // Send the whole user object, backend should handle partial updates/password change logic
      console.log(updatedUser);
      return this.http.put<User>(`${this.USER_API_URL}/updateUser`, updatedUser)
        .pipe(catchError(this.handleError));
  }

   /**
    * Deletes a user by their ID.
    
    */
   deleteUser(userId: number): Observable<void> {
       return this.http.delete<void>(`${this.USER_API_URL}/deleteUser/${userId}`)
         .pipe(catchError(this.handleError));
   }




}