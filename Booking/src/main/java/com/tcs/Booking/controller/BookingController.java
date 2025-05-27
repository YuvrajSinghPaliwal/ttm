package com.tcs.Booking.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin; // Import
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tcs.Booking.DTO.BookTicketRequest;
import com.tcs.Booking.DTO.BookingDTO;
import com.tcs.Booking.DTO.UserDTO;
import com.tcs.Booking.config.BookingException; // Import custom exceptions
import com.tcs.Booking.config.ResourceNotFoundException; // Import custom exceptions
import com.tcs.Booking.model.Booking;
import com.tcs.Booking.service.BookingService;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // <<< Added CORS Configuration
public class BookingController {

	Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	BookingService bookingService;
	
	

	@PostMapping("/cancelBooking/{id}")
	public ResponseEntity<String> cancelBooking(@PathVariable("id") int bookingId) {
	    try {
	        bookingService.cancelBooking(bookingId);
	        return new ResponseEntity<>("Booking cancelled successfully", HttpStatus.OK);
	    } catch (Exception e) {
	        return new ResponseEntity<>("Cancellation failed: " + e.getMessage(), HttpStatus.BAD_REQUEST);
	    }
	}


	@PostMapping("/bookTicket")
	public ResponseEntity<?> BookTicket(@RequestBody BookTicketRequest request) { // Return ResponseEntity<?> for better error handling
		try {
			Booking booking = this.bookingService.BookTicket(
                request.getUserId(),
                request.getTrainNo(),
				request.getDate(),
                request.getAcSeats(),
                request.getSlSeats(),
                request.getPassengers()
            );
			return new ResponseEntity<>(booking, HttpStatus.CREATED);
        } catch (ResourceNotFoundException e) {
            logger.error("Booking failed - Resource not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		} catch (BookingException e) {
            logger.error("Booking failed - Booking error: {}", e.getMessage());
             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) { // Catch broader exceptions from Feign calls etc.
             logger.error("Booking failed - Unexpected error: {}", e.getMessage(), e);
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred during booking.");
		}
	}

	@GetMapping("/getBookings")
	public List<Booking> getBookings() {
		List<Booking> list = this.bookingService.getBookings();
		return list;
	}

	@GetMapping("/getBooking/{id}")
	public ResponseEntity<?> getBooking(@PathVariable("id") int id) { // Use ResponseEntity
        try {
            BookingDTO bookingDTO = this.bookingService.getBooking(id);
            return ResponseEntity.ok(bookingDTO);
        } catch (ResourceNotFoundException e) {
            logger.error("Get booking failed - Resource not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
             logger.error("Get booking failed - Unexpected error: {}", e.getMessage(), e);
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
	}

	@GetMapping("/getAllBookingsOfUser/{userId}")
	public ResponseEntity<?> getAllBookingsOfUser(@PathVariable("userId") int userId) { // Use ResponseEntity
         try {
            UserDTO userDTO = this.bookingService.getAllBookingsOfUser(userId);
            return ResponseEntity.ok(userDTO);
        } catch (ResourceNotFoundException e) {
            logger.error("Get user bookings failed - Resource not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
             logger.error("Get user bookings failed - Unexpected error: {}", e.getMessage(), e);
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
	}
	
	

}