package com.tcs.User.DTO;

import java.util.List;

import com.tcs.User.model.Booking;



public class UserDTO {
	private int userId;
	private String userName;
	private String email;
	
	private List<Booking> bookings;

	@Override
	public String toString() {
		return "UserDTO [userId=" + userId + ", userName=" + userName + ", email=" + email + ", bookings=" + bookings
				+ "]";
	}

	public UserDTO() {
		super();
		// TODO Auto-generated constructor stub
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<Booking> getBookings() {
		return bookings;
	}

	public void setBookings(List<Booking> bookings) {
		this.bookings = bookings;
	}

	public UserDTO(int userId, String userName, String email, List<Booking> bookings) {
		super();
		this.userId = userId;
		this.userName = userName;
		this.email = email;
		this.bookings = bookings;
	}

	public UserDTO(String userName, String email, List<Booking> bookings) {
		super();
		this.userName = userName;
		this.email = email;
		this.bookings = bookings;
	}

	
	
}

