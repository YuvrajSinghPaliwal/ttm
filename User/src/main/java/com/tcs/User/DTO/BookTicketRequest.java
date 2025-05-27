package com.tcs.User.DTO;

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
}
