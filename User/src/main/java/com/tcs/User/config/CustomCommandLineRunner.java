package com.tcs.User.config;


import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.tcs.User.model.User;
import com.tcs.User.service.UserService;



@Component
public class CustomCommandLineRunner implements CommandLineRunner {
	Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	UserService userService;
	@Override
	public void run(String... args) throws Exception {
		// TODO Auto-generated method stub
//		logger.info("***********************************************");
//		logger.info("CommandLineRunner User is working");
//		logger.debug("hi this an error at the debug level");
//
//		User user1=new User("Aman Singh Paliwal", "aman@tcs.com", "Aman@123", "6/B K pocket ,Maroda Sector", "9691529354","Active");
//		User user2=new User("Navpreet Singh Panesar", "navpreet@tcs.com", "Navpreet@123", "249 Mogra ,Talpuri", "7389766677","Inactive");
//		User user3=new User("Deven Ram Khade", "deven@tcs.com", "Deven@123", "6/B K pocket ,Maroda Sector", "9691529354","Active");
//		User user4=new User("Kaustubh Jagtap", "kaustubh@tcs.com", "Kaustubh@123", "249 Mogra ,Talpuri", "7389766677","Inactive");
//		
//		 
//		this.userService.saveUser(user1);
//		this.userService.saveUser(user2);
//		this.userService.saveUser(user3);
//		this.userService.saveUser(user4);
//		
//		logger.debug("all the User are saved");
//		
//		logger.info("***********************************************");
//		
//		//1/ read
//		
//		logger.debug("using findAll");
//		
//		List<User> ulist=userService.getUsers();
//		logger.debug("{}",ulist);
//		
//		logger.info("***********************************************");
//		
//		logger.debug("using findById");
//		
//		User user = this.userService.getUser(1);
//		logger.debug("{}",user);
////		Train res = this.trainService.getTrain(1);
////		logger.debug("{}",res);
//				
//		logger.info("***********************************************");
//
//		logger.info("*****CommandLineRunner User is Stop******************");
//
//		logger.info("***********************************************");
		
		
		
	
	}
}
