package com.tcs.Admin.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tcs.Admin.DTO.TotalSeatsBookedDTO;
import com.tcs.Admin.model.Train;
import com.tcs.Admin.model.TrainRoute;
//import com.tcs.Admin.repository.RouteStationRepository;
import com.tcs.Admin.repository.TrainRepository;
import com.tcs.Admin.repository.TrainRouteRepository;

@Service
public class TrainService {

	@Autowired
	private TrainRepository trainRepository;
//
	@Autowired
	private TrainRouteRepository trainRouteRepository;

	
	public Train saveTrain(Train t) {
		TrainRoute t1=new TrainRoute(t.getTrainNo(),t.getOriginStation(),1,t.getArrivalTime(),t.getArrivalTime()+5,0);
		TrainRoute t2=new TrainRoute(t.getTrainNo(),t.getDestinationStation(),2,t.getDepartureTime(),t.getDepartureTime()+5,t.getDistance());
		
		this.trainRouteRepository.save(t1);
		this.trainRouteRepository.save(t2);
		return this.trainRepository.save(t);
	}

	public TotalSeatsBookedDTO getTotalSeatsBooked() {
		TotalSeatsBookedDTO ts=new TotalSeatsBookedDTO();
		ts.setAcSeats(this.trainRepository.getAllAcTicketsBooked());
		ts.setSlSeats(this.trainRepository.getAllSlTicketsBooked());
		ts.setTotal(ts.getAcSeats()+ts.getSlSeats());
		return ts;
	}
	
	

	public List<Object[]> findTrainsBetweenStations(String originStationName, String destinationStationName) {
		return this.trainRouteRepository.findTrainsBetweenStations(originStationName, destinationStationName);
	}
	
	
	public Train getTrain(int id) throws Exception {
		Train output = this.trainRepository.findById(id).orElseThrow(() -> new Exception("please give correct id"));
		return output;
	}
	
	
	public Train getTrainByNo(int trainNo) {
		return this.trainRepository.findTrainsByNo(trainNo);
	}
	
	
	public List<Train> getTrains() {
		return this.trainRepository.findAll();
	}

	public void updateTrain(Train train) throws Exception {
		if (getTrain(train.getTrainId()) == null) {
			return;
		}
		this.trainRepository.save(train);
	}

	public void deleteTrain(int id) throws Exception {
		Train train = getTrain(id);
		if (train == null) {
			return;
		}
		this.trainRepository.delete(train);
	}
}