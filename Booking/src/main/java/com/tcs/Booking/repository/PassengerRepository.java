package com.tcs.Booking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tcs.Booking.model.Passenger;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger,Integer>{
	List<Passenger> findByBookingId(int bookingId);
}