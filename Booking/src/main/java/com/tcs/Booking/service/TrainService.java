package com.tcs.Booking.service;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.tcs.Booking.model.Train;




@FeignClient(name="ADMIN",url="http://localhost:8102")//port address of bill
public interface TrainService {
	@GetMapping("/getTrainByNo/{trainNo}")
	public Train getTrainByNo(@PathVariable("trainNo") Integer trainNo);
	
	
	@PutMapping("/updateTrain")
	Train updateTrain(@RequestBody Train train);
}
