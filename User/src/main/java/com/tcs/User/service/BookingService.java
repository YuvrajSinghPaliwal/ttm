package com.tcs.User.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.tcs.User.DTO.BookTicketRequest;
import com.tcs.User.DTO.UserDTO;
import com.tcs.User.model.Booking;


@FeignClient(name="Booking",url="http://localhost:8100")
public interface BookingService {
	@PostMapping("/bookTicket")
    public ResponseEntity<Booking> BookTicket(@RequestBody BookTicketRequest request);

	@GetMapping("/getAllBookingsOfUser")
	public UserDTO getAllBookingsOfUser(@RequestParam("userId") int userId);
}

