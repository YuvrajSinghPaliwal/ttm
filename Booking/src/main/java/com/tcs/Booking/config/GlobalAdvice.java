package com.tcs.Booking.config;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class GlobalAdvice {
	public ResponseEntity<Map<String,String>>NoTicketFoundException(NoTicketFoundException e){
		Map<String,String> res = new HashMap<String,String>();
		res.put("message", e.getMessage());
		res.put("date", new Date().toString());
		
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
		
	}
	public ResponseEntity<Map<String, String>> handleResourceNotFound(ResourceNotFoundException e) {
        Map<String, String> res = new HashMap<>();
        res.put("message", e.getMessage());
        res.put("timestamp", new Date().toString());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
    }

    
    public ResponseEntity<Map<String, String>> handleBookingException(BookingException e) {
        Map<String, String> res = new HashMap<>();
        res.put("message", e.getMessage());
        res.put("timestamp", new Date().toString());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    public ResponseEntity<Map<String, String>> handleGenericException(Exception e) {
        Map<String, String> res = new HashMap<>();
        res.put("message", "Internal Server Error: " + e.getMessage());
        res.put("timestamp", new Date().toString());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
    }
}
