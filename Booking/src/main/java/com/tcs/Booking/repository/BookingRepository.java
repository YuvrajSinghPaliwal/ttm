package com.tcs.Booking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tcs.Booking.model.Booking;


public interface BookingRepository extends JpaRepository<Booking, Integer>{
	
	List<Booking> findByUserId(int userId);
}
