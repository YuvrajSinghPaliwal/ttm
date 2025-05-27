package com.tcs.Admin.service;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import com.tcs.Admin.DTO.UserDTO;



@FeignClient(name="USER",url="http://localhost:8101")//port address of bill
public interface UserService {
	 @GetMapping("/getUsers")
		public List<UserDTO> getUsers();
}
