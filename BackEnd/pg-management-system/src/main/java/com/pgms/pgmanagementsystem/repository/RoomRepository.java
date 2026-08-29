
package com.pgms.pgmanagementsystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pgms.pgmanagementsystem.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {

    // Rooms having available beds
    @Query("SELECT r FROM Room r WHERE r.occupiedBeds < r.capacity")
    List<Room> findAvailableRooms();

    // Rooms that are full
    @Query("SELECT r FROM Room r WHERE r.occupiedBeds >= r.capacity")
    List<Room> findFullRooms();
}

