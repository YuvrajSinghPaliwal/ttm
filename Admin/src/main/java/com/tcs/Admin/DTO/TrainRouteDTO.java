package com.tcs.Admin.DTO;
//extra class DTO
public class TrainRouteDTO {
	private String stationName;
    private String arrivalTime;
    private int distanceFromOrigin;
	public String getStationName() {
		return stationName;
	}
	public void setStationName(String stationName) {
		this.stationName = stationName;
	}
	public String getArrivalTime() {
		return arrivalTime;
	}
	public void setArrivalTime(String arrivalTime) {
		this.arrivalTime = arrivalTime;
	}
	public int getDistanceFromOrigin() {
		return distanceFromOrigin;
	}
	public void setDistanceFromOrigin(int distanceFromOrigin) {
		this.distanceFromOrigin = distanceFromOrigin;
	}
	public TrainRouteDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
}
