package com.tcs.Admin.model;


import jakarta.persistence.*;


@Entity
@Table(name = "train_route_pbl")
public class TrainRoute {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "route_id")
    private int routeId;

   
    @Column(name = "train_no", nullable = false)
    private int trainNo;

 
    @Column(name = "station_name")
    private String station;

    @Column(name = "stop_number")
    private Integer stopNumber;

    @Column(name = "arrival_time")
    private String arrivalTime;

    @Column(name = "departure_time")
    private String departureTime;

    @Column(name = "distance_from_source")
    private double distanceFromSource;

    // Constructors, Getters, and Setters
    public TrainRoute() {
    }

	@Override
	public String toString() {
		return "TrainRoute [routeId=" + routeId + ", trainNo=" + trainNo + ", station=" + station + ", stopNumber="
				+ stopNumber + ", arrivalTime=" + arrivalTime + ", departureTime=" + departureTime
				+ ", distanceFromSource=" + distanceFromSource + "]";
	}

	public int getRouteId() {
		return routeId;
	}

	public void setRouteId(int routeId) {
		this.routeId = routeId;
	}

	public int getTrainNo() {
		return trainNo;
	}

	public void setTrainNo(int trainNo) {
		this.trainNo = trainNo;
	}

	public String getStation() {
		return station;
	}

	public void setStation(String station) {
		this.station = station;
	}

	public Integer getStopNumber() {
		return stopNumber;
	}

	public void setStopNumber(Integer stopNumber) {
		this.stopNumber = stopNumber;
	}

	public String getArrivalTime() {
		return arrivalTime;
	}

	public void setArrivalTime(String arrivalTime) {
		this.arrivalTime = arrivalTime;
	}

	public String getDepartureTime() {
		return departureTime;
	}

	public void setDepartureTime(String departureTime) {
		this.departureTime = departureTime;
	}

	public double getDistanceFromSource() {
		return distanceFromSource;
	}

	public void setDistanceFromSource(double distanceFromSource) {
		this.distanceFromSource = distanceFromSource;
	}

	public TrainRoute(int routeId, int trainNo, String station, Integer stopNumber, String arrivalTime,
			String departureTime, double distanceFromSource) {
		super();
		this.routeId = routeId;
		this.trainNo = trainNo;
		this.station = station;
		this.stopNumber = stopNumber;
		this.arrivalTime = arrivalTime;
		this.departureTime = departureTime;
		this.distanceFromSource = distanceFromSource;
	}

	public TrainRoute(int trainNo, String station, Integer stopNumber, String arrivalTime, String departureTime,
			double distanceFromSource) {
		super();
		this.trainNo = trainNo;
		this.station = station;
		this.stopNumber = stopNumber;
		this.arrivalTime = arrivalTime;
		this.departureTime = departureTime;
		this.distanceFromSource = distanceFromSource;
	}

	
    
}