package com.tcs.Booking.config;


import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.tcs.Booking.DTO.BookingDTO;
import com.tcs.Booking.DTO.UserDTO;
import com.tcs.Booking.model.Booking;
import com.tcs.Booking.service.BookingService;


@Component
public class CustomCommandLineRunner  implements CommandLineRunner {
Logger logger = LoggerFactory.getLogger(getClass());
//	
//	@Autowired
//	TicketService ticketService; 

@Autowired
BookingService bookingService;
	@Override
	public void run(String... args) throws Exception {
		// TODO Auto-generated method stub
		
//		logger.info("***********************************************");
//		logger.info("CommandLineRunner is working");
//		logger.debug("hi this an error at the debug level");
//	
//		try {
//			
//			//this.bookingService.BookTicket(4, 10894, "25/01/2025", 4, 3);
//			
//			 
//			logger.debug("all the booking are saved");
//		} catch (Exception e) {
//			logger.error("Error custome booking is not working ",e);
//		}
//		 
//		logger.info("***********************************************");
//		
//		logger.debug("using findAll");
//		
//		List<Booking> bookings = this.bookingService.getBookings();
//		logger.debug("{}",bookings);
//		
//		
//		logger.info("***********************************************");
//		logger.info("***********************************************");
//		
//
//		logger.info("***********************************************");
		
		
		
	
	}

}
