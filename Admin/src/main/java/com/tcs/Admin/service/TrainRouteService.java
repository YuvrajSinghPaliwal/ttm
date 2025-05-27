package com.tcs.Admin.service;




import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tcs.Admin.DTO.TrainRouteDTO;
import com.tcs.Admin.model.TrainRoute;
import com.tcs.Admin.repository.TrainRouteRepository;

@Service
public class TrainRouteService {


	@Autowired
	TrainRouteRepository trainRouteRepository;
	
	public void deleteTrainRoute(TrainRoute tr) {
		this.trainRouteRepository.delete(tr);
	}
	
	public TrainRoute updateTrainRoute(TrainRoute tr) {
		List<TrainRoute> trlist=this.trainRouteRepository.findByTrainNoOrderByStopNumberAsc(tr.getTrainNo());
		
		tr.setStopNumber(trlist.size());
		this.trainRouteRepository.updateTrainRoute(trlist.get(trlist.size()-1).getRouteId(),trlist.size()+1);
		
		return this.trainRouteRepository.save(tr);
	}
	
	
	public void updateTrainRoutes(int trainNo,List<TrainRouteDTO> trainRouteDTO) {

		List<TrainRoute> trlist=this.trainRouteRepository.findByTrainNoOrderByStopNumberAsc(trainNo);
		
		if (trlist.size() < 2) {
	        throw new RuntimeException("Train must have a start and end station.");
	    }
		
		TrainRoute startStation = trlist.get(0); // stopNumber = 1
	    TrainRoute endStation = trlist.get(trlist.size() - 1); // originally stopNumber = 2
		
	 // Step 3: Delete existing intermediate stops (between start and end)
	    for (int i = 1; i < trlist.size() - 1; i++) {
	        trainRouteRepository.delete(trlist.get(i));
	    }

	    // Step 4: Insert new intermediate stops
	    int stopNumber = 2; // Start after the start station
	    for (TrainRouteDTO dto : trainRouteDTO) {
	        TrainRoute route = new TrainRoute();
	        route.setTrainNo(trainNo);
	        route.setStation(dto.getStationName());
	        route.setArrivalTime(dto.getArrivalTime());
	        route.setDistanceFromSource(dto.getDistanceFromOrigin());
	        route.setStopNumber(stopNumber++);
	        trainRouteRepository.save(route);
	    }

	    // Step 5: Update stop number of the end station to be last
	    endStation.setStopNumber(stopNumber);
	    trainRouteRepository.save(endStation);
	    
//	    return  ;
	}
	
	private TrainRoute mapper(TrainRouteDTO dto, int trainNo, int stopNumber) {
	    TrainRoute route = new TrainRoute();
	    route.setTrainNo(trainNo);
	    route.setStation(dto.getStationName());
	    route.setArrivalTime(dto.getArrivalTime());
	    route.setDistanceFromSource(dto.getDistanceFromOrigin());
	    route.setStopNumber(stopNumber);
	    return route;
	}


	
	public TrainRoute addIntermediateStop(TrainRoute newStop) {
	    int trainNo = newStop.getTrainNo(); 
	    List<TrainRoute> routes = trainRouteRepository.findByTrainNoOrderByStopNumberAsc(trainNo);

	    if (routes.size() < 2) {
	        throw new RuntimeException("Train must have at least a start and end station.");
	    }

	    // Assume: First = start, Last = end
	    TrainRoute endStation = routes.get(routes.size() - 1);
	    
	    // Shift down end station and any existing intermediate stops (from stopNumber 2 onward)
	    for (int i = routes.size() - 1; i >= 1; i--) {
	        TrainRoute tr = routes.get(i);
	        tr.setStopNumber(tr.getStopNumber() + 1);
	        trainRouteRepository.save(tr);
	    }

	    // Set new stopNumber to 2 (i.e., between start and end)
	    newStop.setStopNumber(2);
	    return trainRouteRepository.save(newStop);
	}

	public List<TrainRoute> getTrainRoutesByTrainNo(int trainId){
		return this.trainRouteRepository.findByTrainNoOrderByStopNumberAsc(trainId);
		
	}
	
	//insert user 
		public TrainRoute saveTrainRoute(TrainRoute trainRoute) {
			return this.trainRouteRepository.save(trainRoute);
		}
		
		//get all distinct stations
		public List<String> getDistinctStations(){
			return this.trainRouteRepository.getDistinctStations();
		}
		
		//find all users
		public List<TrainRoute> getTrainRoutes() {
			return this.trainRouteRepository.findAll();
		}
		
		public List<TrainRoute> saveTrainRoutes(List<TrainRoute> trainRoutes){
			return this.trainRouteRepository.saveAll(trainRoutes);
		}
	
}