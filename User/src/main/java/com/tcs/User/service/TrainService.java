package com.tcs.User.service;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import com.tcs.User.DTO.FindTrainByRouteDTO;



@FeignClient(name="ADMIN",url="http://localhost:8102")//port address of bill
public interface TrainService {
	@GetMapping("/getTrainsBetween")
	public List<Object[]> getTrainsBetweenStations(FindTrainByRouteDTO findTrainByRouteDTO);

}
