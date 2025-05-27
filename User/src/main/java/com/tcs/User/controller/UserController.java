package com.tcs.User.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin; // Import
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tcs.User.DTO.BookTicketRequest;
import com.tcs.User.DTO.FindTrainByRouteDTO;
import com.tcs.User.config.EmailAlreadyRegisteredException;
import com.tcs.User.model.Booking;
import com.tcs.User.model.User;
import com.tcs.User.service.BookingService;
import com.tcs.User.service.TrainService;
import com.tcs.User.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // <<< Added CORS Configuration
//@RequestMapping("/user") // Base path can be added if desired
public class UserController {

	@Autowired
	UserService userService;
	@Autowired
	TrainService trainService;
	@Autowired
	BookingService bookingService;

	//Note: VERIFY ENDPOINTS BEFORE USE.
	
	
	@PostMapping("/registerUser")
   	public ResponseEntity<User> registerUser(@RequestBody User user) { // Use @RequestBody for JSON
        try {
            User registeredUser = this.userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (EmailAlreadyRegisteredException e) {
             return ResponseEntity.status(HttpStatus.CONFLICT).build(); // Or return error details
        } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Or return error details
        }
   	}
	
	
	@PostMapping("/login")
   	public ResponseEntity<User> loginUser(@RequestParam("email") String email, @RequestParam("password") String password) { // Use @RequestBody for JSON
        try {
            User user = this.userService.loginUser(email, password);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            // Consider more specific exception handling from service
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Or return error details
        }
   	}

    
	
	@GetMapping("/getTrainsBetween")
	public List<Object[]> getTrainsBetweenStations(FindTrainByRouteDTO findTrainByRouteDTO) {
        return this.trainService.getTrainsBetweenStations(findTrainByRouteDTO);
	}

    @GetMapping("/getUsers")
	public List<User> getUsers() {
    	List<User> list=this.userService.getUsers();
		return list;
	}

    
    @PostMapping("/bookTicket")
    public ResponseEntity<Booking> bookTicket(@RequestBody BookTicketRequest request) {
         // This controller method might just act as a proxy if needed, or be removed
         // if Angular calls Booking directly. For now, assuming it proxies.
         return this.bookingService.BookTicket(request);
    }

    @GetMapping("/getUserById/{id}")
   	public User getUserById(@PathVariable("id") int id) throws Exception  {
       	return this.userService.getUser(id);
   	}

    
    //update User record 
     @PutMapping("/updateUser")
     public ResponseEntity<User> updateUser(@RequestBody User user) { 
    	 try {
             User updateUser = this.userService.updateUser(user);
             return ResponseEntity.status(HttpStatus.CREATED).body(updateUser);
         } catch (EmailAlreadyRegisteredException e) {
              return ResponseEntity.status(HttpStatus.CONFLICT).build(); // Or return error details
         } catch (Exception e) {
              return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Or return error details
         }
     }

     @DeleteMapping("/deleteUser/{id}")
     public void deleteUser(@PathVariable("id") int id)throws Exception {
    	 this.userService.deleteUser(id);
    	 
     }
}