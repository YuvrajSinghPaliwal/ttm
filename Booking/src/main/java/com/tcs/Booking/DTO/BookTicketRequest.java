package com.tcs.Booking.DTO;

import java.util.List;

public class BookTicketRequest {

    private int userId;
    private int trainNo;
    private String date;
    private int acSeats;
    private int slSeats;
    private List<PassengerDTO> passengers;

    // Getters and Setters

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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getAcSeats() {
        return acSeats;
    }

    public void setAcSeats(int acSeats) {
        this.acSeats = acSeats;
    }

    public int getSlSeats() {
        return slSeats;
    }

    public void setSlSeats(int slSeats) {
        this.slSeats = slSeats;
    }

    public List<PassengerDTO> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<PassengerDTO> passengers) {
        this.passengers = passengers;
    }

	public BookTicketRequest(int userId, int trainNo, String date, int acSeats, int slSeats,
			List<PassengerDTO> passengers) {
		super();
		this.userId = userId;
		this.trainNo = trainNo;
		this.date = date;
		this.acSeats = acSeats;
		this.slSeats = slSeats;
		this.passengers = passengers;
	}

	public BookTicketRequest(int trainNo, String date, int acSeats, int slSeats, List<PassengerDTO> passengers) {
		super();
		this.trainNo = trainNo;
		this.date = date;
		this.acSeats = acSeats;
		this.slSeats = slSeats;
		this.passengers = passengers;
	}

	public BookTicketRequest() {
		super();
		// TODO Auto-generated constructor stub
	}

	@Override
	public String toString() {
		return "BookTicketRequest [userId=" + userId + ", trainNo=" + trainNo + ", date=" + date + ", acSeats="
				+ acSeats + ", slSeats=" + slSeats + ", passengers=" + passengers + "]";
	}
    
    
    
}
