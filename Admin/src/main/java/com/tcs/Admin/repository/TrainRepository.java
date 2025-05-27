package com.tcs.Admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tcs.Admin.model.Train;



public interface TrainRepository extends JpaRepository<Train, Integer>{
	 @Query("SELECT t FROM train_pbl t where trainNo= :trainNo")
	    Train findTrainsByNo(@Param("trainNo") int trainNo);
	 
	 @Query(value = "SELECT SUM(t.TOTAL_AC_SEATS-t.AVAILABLE_AC_SEATS) from train_pbl t",
			 nativeQuery = true)
	 int getAllAcTicketsBooked();
	 
	 @Query(value = "SELECT SUM(t.TOTAL_SLEEPER_SEATS-T.AVAILABLE_SLEEPER_SEATS) from train_pbl t ",
			 nativeQuery = true)
	 int getAllSlTicketsBooked();
	
}