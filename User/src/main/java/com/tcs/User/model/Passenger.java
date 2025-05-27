package com.tcs.User.model;

public class Passenger {
	private int id;
	private int bookingId;
	private String SeatNumber;
	private String name;
	private int age;
	private String gender;
	
	public Passenger() {}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getBookingId() {
		return bookingId;
	}

	public void setBookingId(int bookingId) {
		this.bookingId = bookingId;
	}

	public String getSeatNumber() {
		return SeatNumber;
	}

	public void setSeatNumber(String seatNumber) {
		SeatNumber = seatNumber;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public Passenger(int id, int bookingId, String seatNumber, String name, int age, String gender) {
		super();
		this.id = id;
		this.bookingId = bookingId;
		SeatNumber = seatNumber;
		this.name = name;
		this.age = age;
		this.gender = gender;
	}

	public Passenger(int bookingId, String seatNumber, String name, int age, String gender) {
		super();
		this.bookingId = bookingId;
		SeatNumber = seatNumber;
		this.name = name;
		this.age = age;
		this.gender = gender;
	}

	@Override
	public String toString() {
		return "Passenger [id=" + id + ", bookingId=" + bookingId + ", SeatNumber=" + SeatNumber + ", name=" + name
				+ ", age=" + age + ", gender=" + gender + "]";
	}

	
}
