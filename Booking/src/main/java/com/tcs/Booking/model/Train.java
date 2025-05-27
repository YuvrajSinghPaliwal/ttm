package com.tcs.Booking.model;

public class Train {
	private int trainId;
	private int trainNo;
	private String trainName; 
	private String originStation; 
	private String destinationStation; 
	private String departureTime; 
	private String arrivalTime; 
	private int totalAcSeats;
	private int availableAcSeats;
	private int totalSleeperSeats;
	private int availableSleeperSeats;
	private int distance;
	
	
	public Train() {}


	public Train(int trainId, int trainNo, String trainName, String originStation, String destinationStation,
			String departureTime, String arrivalTime, int totalAcSeats, int availableAcSeats, int totalSleeperSeats,
			int availableSleeperSeats, int distance) {
		super();
		this.trainId = trainId;
		this.trainNo = trainNo;
		this.trainName = trainName;
		this.originStation = originStation;
		this.destinationStation = destinationStation;
		this.departureTime = departureTime;
		this.arrivalTime = arrivalTime;
		this.totalAcSeats = totalAcSeats;
		this.availableAcSeats = availableAcSeats;
		this.totalSleeperSeats = totalSleeperSeats;
		this.availableSleeperSeats = availableSleeperSeats;
		this.distance = distance;
	}


	public Train(int trainNo, String trainName, String originStation, String destinationStation, String departureTime,
			String arrivalTime, int totalAcSeats, int availableAcSeats, int totalSleeperSeats,
			int availableSleeperSeats, int distance) {
		super();
		this.trainNo = trainNo;
		this.trainName = trainName;
		this.originStation = originStation;
		this.destinationStation = destinationStation;
		this.departureTime = departureTime;
		this.arrivalTime = arrivalTime;
		this.totalAcSeats = totalAcSeats;
		this.availableAcSeats = availableAcSeats;
		this.totalSleeperSeats = totalSleeperSeats;
		this.availableSleeperSeats = availableSleeperSeats;
		this.distance = distance;
	}


	public int getTrainId() {
		return trainId;
	}


	public void setTrainId(int trainId) {
		this.trainId = trainId;
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


	public String getOriginStation() {
		return originStation;
	}


	public void setOriginStation(String originStation) {
		this.originStation = originStation;
	}


	public String getDestinationStation() {
		return destinationStation;
	}


	public void setDestinationStation(String destinationStation) {
		this.destinationStation = destinationStation;
	}


	public String getDepartureTime() {
		return departureTime;
	}


	public void setDepartureTime(String departureTime) {
		this.departureTime = departureTime;
	}


	public String getArrivalTime() {
		return arrivalTime;
	}


	public void setArrivalTime(String arrivalTime) {
		this.arrivalTime = arrivalTime;
	}


	public int getTotalAcSeats() {
		return totalAcSeats;
	}


	public void setTotalAcSeats(int totalAcSeats) {
		this.totalAcSeats = totalAcSeats;
	}


	public int getAvailableAcSeats() {
		return availableAcSeats;
	}


	public void setAvailableAcSeats(int availableAcSeats) {
		this.availableAcSeats = availableAcSeats;
	}


	public int getTotalSleeperSeats() {
		return totalSleeperSeats;
	}


	public void setTotalSleeperSeats(int totalSleeperSeats) {
		this.totalSleeperSeats = totalSleeperSeats;
	}


	public int getAvailableSleeperSeats() {
		return availableSleeperSeats;
	}


	public void setAvailableSleeperSeats(int availableSleeperSeats) {
		this.availableSleeperSeats = availableSleeperSeats;
	}


	public int getDistance() {
		return distance;
	}


	public void setDistance(int distance) {
		this.distance = distance;
	}


	@Override
	public String toString() {
		return "Train [trainId=" + trainId + ", trainNo=" + trainNo + ", trainName=" + trainName + ", originStation="
				+ originStation + ", destinationStation=" + destinationStation + ", departureTime=" + departureTime
				+ ", arrivalTime=" + arrivalTime + ", totalAcSeats=" + totalAcSeats + ", availableAcSeats="
				+ availableAcSeats + ", totalSleeperSeats=" + totalSleeperSeats + ", availableSleeperSeats="
				+ availableSleeperSeats + ", distance=" + distance + "]";
	}

}
