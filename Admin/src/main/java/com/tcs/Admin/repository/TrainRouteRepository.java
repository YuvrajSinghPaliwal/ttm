package com.tcs.Admin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tcs.Admin.model.TrainRoute;

import jakarta.transaction.Transactional;

public interface TrainRouteRepository extends JpaRepository<TrainRoute, Integer> {
	
	@Query(value = "SELECT DISTINCT t.train_id, t.train_no, t.train_name, tr1.station_name, tr2.station_name, " +
            "tr1.arrival_time, tr2.arrival_time, t.TOTAL_AC_SEATS, t.AVAILABLE_AC_SEATS, " +
            "t.TOTAL_SLEEPER_SEATS, t.AVAILABLE_SLEEPER_SEATS " +
            "FROM train_pbl t " +
            "INNER JOIN train_route_pbl tr1 ON t.train_no = tr1.train_no " +
            "INNER JOIN train_route_pbl tr2 ON t.train_no = tr2.train_no " +
            "WHERE LOWER(tr1.station_name) = LOWER(:originStationName) " +
            "  AND LOWER(tr2.station_name) = LOWER(:destinationStationName) " +
            "  AND tr1.stop_number < tr2.stop_number " +
            "ORDER BY t.train_no", nativeQuery = true)
	
	List<Object[]> findTrainsBetweenStations(
	 @Param("originStationName") String originStationName,
	 @Param("destinationStationName") String destinationStationName
	);




	List<TrainRoute> findByTrainNoOrderByStopNumberAsc(int trainNo);

	@Modifying
	@Transactional
	@Query("UPDATE TrainRoute tr SET tr.stopNumber = :stopNumber WHERE tr.routeId = :routeId")
	int updateTrainRoute(@Param("routeId") int routeId, @Param("stopNumber") Integer stopNumber);
	
	
	@Query(value = "SELECT DISTINCT station_name from train_route_pbl",
			nativeQuery = true)
			List<String> getDistinctStations();
	
}