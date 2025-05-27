// Code used for testing
package com.tcs.Admin.config;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.tcs.Admin.model.Train;
import com.tcs.Admin.service.TrainService;


@Component
public class CustomCommandLineRunner  implements CommandLineRunner {
Logger logger = LoggerFactory.getLogger(getClass());

@Autowired
TrainService trainService;
	@Override
	public void run(String... args) throws Exception {
		// Values for testing purpose
//		logger.info("***********************************************");
//		logger.info("CommandLineRunner Admin is working");
//		logger.debug("hi this an error at the debug level");
//
//
//		Train t1=new Train(10893,"Sarnath Express", "Durg", "Uttarpradesh", "20:25", "14:00",50,50,200,200,100);
//		Train t2=new Train(22343,"Gitanjali Express", "Mumbai", "Nagpur", "03:00", "18:10",50,50,200,200,100);
//	
//
//		this.trainService.saveTrain(t1);
//		this.trainService.saveTrain(t2);
//	
//		logger.debug("all the bills are saved");
//		
//		logger.info("***********************************************");
//		
//		//1/ read
//		
//		logger.debug("using findAll");
//		List<Train> tlist=trainService.getTrains();
//		logger.debug("{}",tlist);
//		
//		logger.info("***********************************************");
//		
//		logger.debug("using findById");
//		Train res = this.trainService.getTrain(1);
//		logger.debug("{}",res);
//				
//		logger.info("***********************************************");
//
//		logger.debug("using findBytrainNo");
//		Train tt = this.trainService.getTrainByNo(10893);
//		logger.debug("{}",tt);
//				
//		logger.info("***********************************************");
//		logger.info("*****CommandLineRunner Admin End******************");
//		logger.info("***********************************************");
		
		
		
	
	}

}
