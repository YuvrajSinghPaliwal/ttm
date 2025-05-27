package com.tcs.User.DTO;

import java.util.List;

import com.tcs.User.model.Passenger;


public class BookingDTO {
	private int bookingId;
	private int userId;
	private int trainNo;
	private String trainName;
	private String fromStation;
	private String toStation;
	private String startTime;
	private String endTime;
	private String journeyDate;
	private String seatNumbers;
	private String bookingDate;
	private int price;
	private List<Passenger> passengers;
	
	private String bookingStatus;

	@Override
	public String toString() {
		return "BookingDTO [bookingId=" + bookingId + ", userId=" + userId + ", trainNo=" + trainNo + ", trainName="
				+ trainName + ", fromStation=" + fromStation + ", toStation=" + toStation + ", startTime=" + startTime
				+ ", endTime=" + endTime + ", journeyDate=" + journeyDate + ", seatNumbers=" + seatNumbers
				+ ", bookingDate=" + bookingDate + ", price=" + price + ", passengers=" + passengers
				+ ", bookingStatus=" + bookingStatus + "]";
	}

	public BookingDTO() {
		super();
		// TODO Auto-generated constructor stub
	}

	public int getBookingId() {
		return bookingId;
	}

	public void setBookingId(int bookingId) {
		this.bookingId = bookingId;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public int getTrainNo() {
		return trainNo;
	}

	public void setTrainNo(int trainNo) {
		this.trainNo = trainNo;
	}

	public String getTrainName() {
		return trainName;
	}

	public void setTrainName(String trainName) {
		this.trainName = trainName;
	}

	public String getFromStation() {
		return fromStation;
	}

	public void setFromStation(String fromStation) {
		this.fromStation = fromStation;
	}

	public String getToStation() {
		return toStation;
	}

	public void setToStation(String toStation) {
		this.toStation = toStation;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public String getJourneyDate() {
		return journeyDate;
	}

	public void setJourneyDate(String journeyDate) {
		this.journeyDate = journeyDate;
	}

	public String getSeatNumbers() {
		return seatNumbers;
	}

	public void setSeatNumbers(String seatNumbers) {
		this.seatNumbers = seatNumbers;
	}

	public String getBookingDate() {
		return bookingDate;
	}

	public void setBookingDate(String bookingDate) {
		this.bookingDate = bookingDate;
	}

	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	public List<Passenger> getPassengers() {
		return passengers;
	}

	public void setPassengers(List<Passenger> passengers) {
		this.passengers = passengers;
	}

	public String getBookingStatus() {
		return bookingStatus;
	}

	public void setBookingStatus(String bookingStatus) {
		this.bookingStatus = bookingStatus;
	}

	public BookingDTO(int bookingId, int userId, int trainNo, String trainName, String fromStation, String toStation,
			String startTime, String endTime, String journeyDate, String seatNumbers, String bookingDate, int price,
			List<Passenger> passengers, String bookingStatus) {
		super();
		this.bookingId = bookingId;
		this.userId = userId;
		this.trainNo = trainNo;
		this.trainName = trainName;
		this.fromStation = fromStation;
		this.toStation = toStation;
		this.startTime = startTime;
		this.endTime = endTime;
		this.journeyDate = journeyDate;
		this.seatNumbers = seatNumbers;
		this.bookingDate = bookingDate;
		this.price = price;
		this.passengers = passengers;
		this.bookingStatus = bookingStatus;
	}

	public BookingDTO(int userId, int trainNo, String trainName, String fromStation, String toStation, String startTime,
			String endTime, String journeyDate, String seatNumbers, String bookingDate, int price,
			List<Passenger> passengers, String bookingStatus) {
		super();
		this.userId = userId;
		this.trainNo = trainNo;
		this.trainName = trainName;
		this.fromStation = fromStation;
		this.toStation = toStation;
		this.startTime = startTime;
		this.endTime = endTime;
		this.journeyDate = journeyDate;
		this.seatNumbers = seatNumbers;
		this.bookingDate = bookingDate;
		this.price = price;
		this.passengers = passengers;
		this.bookingStatus = bookingStatus;
	}
	
	



	
}
