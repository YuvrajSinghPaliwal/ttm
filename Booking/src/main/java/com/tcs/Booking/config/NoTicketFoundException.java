package com.tcs.Booking.config;

public class NoTicketFoundException extends RuntimeException {
	public NoTicketFoundException(String message) {
		super(message);
	}

}
