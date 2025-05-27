package com.tcs.User.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tcs.User.config.EmailAlreadyRegisteredException;
import com.tcs.User.config.InvalidCredentialsException;
import com.tcs.User.config.UserNotFoundException;
import com.tcs.User.model.User;
import com.tcs.User.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;
	
	Logger logger = LoggerFactory.getLogger(getClass());
	// findbyId
	public User getUser(int id) throws Exception {
		User output = this.userRepository.findById(id).orElseThrow(() -> new Exception("please give correct id"));
		return output;
	}

	// insert user
	public User saveUser(User user) {
		return this.userRepository.save(user);
	}
	
	public User updateUser(User user) {
		if(user.getPassword() == null) {
			User tempUser = this.userRepository.findById(user.getUserId()).orElseThrow(() -> new InvalidCredentialsException("Please check the ID"));
			user.setPassword(tempUser.getPassword());			
		}		

		return this.userRepository.save(user);
	}

	// find all users
	public List<User> getUsers()  throws UserNotFoundException {
		List<User> op =this.userRepository.findAll();
		if(op == null) {
			throw new UserNotFoundException("No User In Database");
		}
		return op;
	}


	 // Login user
    public User loginUser(String email, String password) {
        User user = this.userRepository.loginUser(email, password);
        if (user == null) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }
        return user;
    }

	
	public User registerUser(User user) {
        String existingEmail = this.userRepository.check(user.getEmail());
        if (existingEmail != null) {
            throw new EmailAlreadyRegisteredException("Email is already registered.");
        }
        return this.userRepository.save(user);
    }
	
	public void deleteUser(int id) {
	    User user = userRepository.findById(id).orElse(null);
	    if (user != null) {
	        userRepository.delete(user);
	    }
	} 

}