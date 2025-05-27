
package com.tcs.Booking.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tcs.Booking.DTO.BookingDTO;
import com.tcs.Booking.DTO.PassengerDTO;
import com.tcs.Booking.DTO.UserDTO;
import com.tcs.Booking.config.BookingException;
import com.tcs.Booking.config.ResourceNotFoundException;
import com.tcs.Booking.model.Booking;
import com.tcs.Booking.model.Passenger;
import com.tcs.Booking.model.Train;
import com.tcs.Booking.model.User;
import com.tcs.Booking.repository.BookingRepository;

@Service
public class BookingService {

	Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private BookingRepository bookingRepository;

	@Autowired
	private UserService userService;

	@Autowired
	private TrainService trainService;

	@Autowired
	private PassengerService passengerService;

	public void cancelBooking(int bookingId) throws Exception {
	    Booking booking = bookingRepository.findById(bookingId)
	        .orElseThrow(() -> new Exception("Booking not found"));

	    if ("CANCELLED".equalsIgnoreCase(booking.getBookingStatus())) {
	        throw new Exception("Booking is already cancelled");
	    }

	    booking.setBookingStatus("CANCELLED");
	    bookingRepository.save(booking);
	}
	
	public Booking BookTicket(int userId, int trainNo, String date, int acSeats, int slSeats,
			List<PassengerDTO> passangers) throws Exception {

		User user = this.userService.getUser(userId);
		if (user == null)
	        throw new ResourceNotFoundException("User with ID " + userId + " not found");
		Train train = this.trainService.getTrainByNo(trainNo);
		if (train == null)
	        throw new ResourceNotFoundException("Train with number " + trainNo + " not found");
		
		int totalseatbooked = acSeats + slSeats;
		
		if (train.getAvailableAcSeats() < acSeats || train.getAvailableSleeperSeats() < slSeats)
		        throw new BookingException("Insufficient seats available");
		 if (passangers == null || passangers.size() != (acSeats + slSeats))
		        throw new BookingException("Mismatch between seat count and passenger list size");
		
		List<Passenger> ps = new ArrayList<Passenger>(totalseatbooked);
		double acMultiplier = 2.5;
		double slMultiplier = 1.5;

		int acFare = (int) (train.getDistance() * acMultiplier) * acSeats;
		int slFare = (int) (train.getDistance() * slMultiplier) * slSeats;

		int totalFare = acFare + slFare;
		int price = totalFare;
		// Seat allocation
		int acStart = train.getTotalAcSeats() - train.getAvailableAcSeats();
		int slStart = train.getTotalSleeperSeats() - train.getAvailableSleeperSeats();

		List<String> seatNumbers = new ArrayList<>();
		for (int i = 1; i <= acSeats; i++) {
			seatNumbers.add("AC" + (acStart + i));
		}
		for (int i = 1; i <= slSeats; i++) {
			seatNumbers.add("SL" + (slStart + i));
		}

		String seats = String.join(" ", seatNumbers);
		Booking booking = new Booking(user.getUserId(), train.getTrainNo(), train.getTrainName(),
				train.getOriginStation(), train.getDestinationStation(), train.getDepartureTime(),
				train.getArrivalTime(), date, seats, LocalDate.now().toString(), price, "Confirmed");
		booking = this.bookingRepository.save(booking);
		// Map passengers
		List<Passenger> passengerEntities = new ArrayList<>();
		for (int i = 0; i < passangers.size(); i++) {
			PassengerDTO dto = passangers.get(i);
			Passenger p = new Passenger();
			p.setBookingId(booking.getBookingId());
			p.setSeatNumber(seatNumbers.get(i));
			p.setName(dto.getName());
			p.setAge(dto.getAge());
			p.setGender(dto.getGender());
			passengerEntities.add(p);
		}

		List<Passenger> os = this.passengerService.saveAllPassenger(passengerEntities);
		this.bookingRepository.save(booking);
		// Update train seat availability
		train.setAvailableAcSeats(train.getAvailableAcSeats() - acSeats);
		train.setAvailableSleeperSeats(train.getAvailableSleeperSeats() - slSeats);
		this.trainService.updateTrain(train);

		return booking;
	}

	// find all users
	public List<Booking> getBookings() {
		return this.bookingRepository.findAll();
	}

	// findbyId
	public BookingDTO getBooking(int id) throws Exception {
		Booking output = this.bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking ID " + id + " not found"));
		User user = this.userService.getUser(output.getUserId());
		if (user == null)
	        throw new ResourceNotFoundException("User not found for booking ID " + id);
		BookingDTO bookingDTO = mapper(output);
		bookingDTO.setUser(user);
		List<Passenger> passengers = this.passengerService.getAllPassengerByBookingId(id);
		bookingDTO.setPassengers(passengers);
		return bookingDTO;
	}

	// find all users
	public List<Booking> getBookingsByUserId(int userid) {
		return this.bookingRepository.findAll();
	}

	public UserDTO getAllBookingsOfUser(int userId) {
		User user = this.userService.getUser(userId);
		List<Booking> bookings = this.bookingRepository.findByUserId(user.getUserId());
		UserDTO userDTO = mapper(user);
		userDTO.setBookings(bookings);
		return userDTO;
	}

	private UserDTO mapper(User user) {
		UserDTO userDTO = new UserDTO();
		userDTO.setUserId(user.getUserId());
		userDTO.setUserName(user.getUserName());
		userDTO.setEmail(user.getEmail());
		return userDTO;

	}

	private BookingDTO mapper(Booking booking) {
		BookingDTO bookingDTO = new BookingDTO();
		bookingDTO.setUserId(booking.getUserId());
		bookingDTO.setTrainNo(booking.getTrainNo());
		bookingDTO.setTrainName(booking.getTrainName());
		bookingDTO.setFromStation(booking.getFromStation());
		bookingDTO.setToStation(booking.getToStation());
		bookingDTO.setStartTime(booking.getStartTime());

		bookingDTO.setEndTime(booking.getEndTime());
		bookingDTO.setJourneyDate(booking.getJourneyDate());
		bookingDTO.setSeatNumbers(booking.getSeatNumbers());
		bookingDTO.setBookingDate(booking.getBookingDate());
		bookingDTO.setPrice(booking.getPrice());
		bookingDTO.setBookingStatus(booking.getBookingStatus());
		return bookingDTO;

	}

}