export interface Train {
  trainId: number; // Java int maps to number
  trainNo: number; // Java int maps to number
  trainName: string;
  originStation: string;
  destinationStation: string;
  departureTime: string; // e.g., "HH:mm"
  arrivalTime: string;   // e.g., "HH:mm"
  totalAcSeats: number;
  availableAcSeats: number;
  totalSleeperSeats: number;
  availableSleeperSeats: number;
  distance: number;

}

// Interface for the search results from getTrainsBetweenStations List<Object[]>

export interface TrainSearchResult {
    trainId: number;
    trainNo: number;
    trainName: string;
    originStation: string; // Corresponds to tr1.station_name
    destinationStation: string; // Corresponds to tr2.station_name
    originArrivalTime: string | null; // Corresponds to tr1.arrival_time (might be null for first stop)
    destinationArrivalTime: string | null; // Corresponds to tr2.arrival_time
    totalAcSeats: number;
    availableAcSeats: number;
    totalSleeperSeats: number;
    availableSleeperSeats: number;
    // You might want to add departure times if needed, requires modifying Java query/DTO
    departureTime?: string; // Add if backend provides it
    arrivalTime?: string; // Add if backend provides overall arrival
}

// Interface for detailed route segments if fetched separately
// Matches com.tcs.Admin.model.TrainRoute
export interface RouteSegment {
    routeId: number;
    trainNo: number;
    station: string; // Renamed from stationName for consistency? Check Java
    stopNumber: number;
    arrivalTime?: string; // Optional
    departureTime?: string; // Optional
    distanceFromSource?: number; // Optional
}