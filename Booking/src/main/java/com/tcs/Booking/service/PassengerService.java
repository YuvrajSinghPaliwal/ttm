package com.tcs.Booking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tcs.Booking.model.Passenger;
import com.tcs.Booking.repository.PassengerRepository;

@Service
public class PassengerService {
	@Autowired
	PassengerRepository passengerRepository ;
	
	public List<Passenger> saveAllPassenger(List<Passenger> passengers) {
		return this.passengerRepository.saveAll(passengers);
	}
	
	
	public List<Passenger> getAllPassengerByBookingId(int bookingId) {
		return this.passengerRepository.findByBookingId(bookingId);
	}
}
