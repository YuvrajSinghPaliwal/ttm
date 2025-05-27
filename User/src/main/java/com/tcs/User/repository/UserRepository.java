package com.tcs.User.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tcs.User.model.User;
@Repository
public interface  UserRepository extends JpaRepository<User, Integer>{

	 @Query(value = "SELECT * from user_pbl u where u.email= :email AND u.password= :password",
     nativeQuery = true)
     User loginUser(
     @Param("email") String originStationName,
     @Param("password") String destinationStationName );
	
	 @Query(value = "SELECT email from user_pbl u where u.email= :email",
		    nativeQuery = true)
		  String check(
		     @Param("email") String originStationName);
		     
}