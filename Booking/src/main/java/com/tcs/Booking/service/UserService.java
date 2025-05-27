package com.tcs.Booking.service;



import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.tcs.Booking.model.User;


@FeignClient(name="USER",url="http://localhost:8101")//port address of bill
public interface UserService {
	@GetMapping("/getUserById/{id}")
	public User getUser(@PathVariable("id") Integer id);
}
