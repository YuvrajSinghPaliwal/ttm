package com.tcs.Admin.DTO;

//extra class DTO 


public class TotalSeatsBookedDTO {
	private int acSeats;
	private int slSeats;
	private int total;
	@Override
	public String toString() {
		return "TotalSeatsBookedDTO [acSeats=" + acSeats + ", slSeats=" + slSeats + ", total=" + total + "]";
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
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public TotalSeatsBookedDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
}
