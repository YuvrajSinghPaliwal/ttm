package com.tcs.Admin.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tcs.Admin.DTO.FindTrainByRouteDTO;
import com.tcs.Admin.DTO.TotalSeatsBookedDTO;
import com.tcs.Admin.DTO.TrainRouteDTO;
import com.tcs.Admin.model.Train;
import com.tcs.Admin.model.TrainRoute;
import com.tcs.Admin.service.TrainRouteService;
import com.tcs.Admin.service.TrainService;


@RestController
@CrossOrigin(origins = "http://localhost:4200/")
//@RequestMapping("/train")
public class AdminController {

	Logger logger =LoggerFactory.getLogger(getClass());
	
	@Autowired
	TrainService trainService;
    
    @Autowired
	TrainRouteService trainRouteService;
    

    @GetMapping("/getAllStationNames")
    public List<String> getDistinctStations(){
    	return this.trainRouteService.getDistinctStations();
    }
    
    @GetMapping("/getTrains")
	public List<Train> getTrains() {
    	List<Train> list=this.trainService.getTrains();
		return list;
	}
    
    @GetMapping("/getTrainsBetween")
	public List<Object[]> getTrainsBetweenStations(FindTrainByRouteDTO findTrainByRouteDTO) {
    	List<Object[]> list=this.trainService.findTrainsBetweenStations(findTrainByRouteDTO.getSource(), findTrainByRouteDTO.getDestination());
		return list;
	}
	
	@GetMapping("/getTrain/{id}")
   	public Train getTrain(@PathVariable("id") int id) throws Exception {
       	return this.trainService.getTrain(id);
   	}
    @GetMapping("/getTrainByNo/{trainNo}")
   	public Train getTrainByNo(@PathVariable("trainNo") int trainNo) throws Exception {
       	return this.trainService.getTrainByNo(trainNo);
   	}

    @PutMapping("/updateTrain")
   	public Train updateTrain(@RequestBody Train train) throws Exception {
       	this.trainService.updateTrain(train);
       	return train;
   	}
    
    @DeleteMapping("/deleteTrain/{id}")
   	public void deleteTrain(@PathVariable("id") int id) throws Exception {
       	this.trainService.deleteTrain(id);	
   	}
    
    @PostMapping("/saveTrain")
   	public Train saveTrain(@RequestBody Train train) {
       return this.trainService.saveTrain(train);
   	}
    
    //routes controllers
    
    @PostMapping("/updateTrainRoute")
    public TrainRoute updateTrainRoute(@RequestBody TrainRoute tr) {
    	return this.trainRouteService.updateTrainRoute(tr);
    }
    
    @GetMapping("/getTrainRoutesByTrainNo")
    public List<TrainRoute> getTrainRoutesByTrainNo(@RequestParam("trainId")int trainId) throws Exception{
    	List<TrainRoute> trs = this.trainRouteService.getTrainRoutesByTrainNo(trainId);
    	if(trs==null) {
    		throw new Exception("Train Routes Not Found");
    		}
    	return trs;
    	}
    	
    	
    	//addIntermediateStop
        
        @PutMapping("/updateTrainRoutes")
        public String updateTrainRoute( @RequestParam("trainNo") int trainNo, @RequestBody List<TrainRouteDTO> trainRouteDTOs) {

            try {
                trainRouteService.updateTrainRoutes(trainNo, trainRouteDTOs);
                return "Train route updated successfully.";
            } catch (RuntimeException e) {
                return "Error updating train route: " + e.getMessage();
            } catch (Exception e) {
                return "Unexpected error occurred.";
            }
        }

        @GetMapping("/getTotalTicketsBooked")
        public TotalSeatsBookedDTO getTotalSeatsBooked() {
        	return this.trainService.getTotalSeatsBooked();
        }
    	
    	

	@GetMapping("/getTrainRoutes")
	public List<TrainRoute> getTrainRoutes(){
		return this.trainRouteService.getTrainRoutes();
	}
	
	@PostMapping("/saveTrainRoute")
	public TrainRoute saveTrainRoute(@RequestBody TrainRoute trainRoute) {
	
		return this.trainRouteService.saveTrainRoute(trainRoute);
	}
	
	@PostMapping("/saveTrainRoutes")
	public List<TrainRoute> saveTrainRoutes(@RequestBody List<TrainRoute> trainRoutes) {
		return this.trainRouteService.saveTrainRoutes(trainRoutes);
	}
}
