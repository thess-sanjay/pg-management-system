
package com.pgms.pgmanagementsystem.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pgms.pgmanagementsystem.dto.DashboardSummary;
import com.pgms.pgmanagementsystem.entity.RentRecord;
import com.pgms.pgmanagementsystem.entity.Room;
import com.pgms.pgmanagementsystem.repository.RentRecordRepository;
import com.pgms.pgmanagementsystem.repository.RoomRepository;
import com.pgms.pgmanagementsystem.repository.TenantRepository;

@Service
public class DashboardService {

    private final RoomRepository roomRepository;
    private final TenantRepository tenantRepository;
    private final RentRecordRepository rentRecordRepository;

    public DashboardService(
            RoomRepository roomRepository,
            TenantRepository tenantRepository,
            RentRecordRepository rentRecordRepository) {

        this.roomRepository = roomRepository;
        this.tenantRepository = tenantRepository;
        this.rentRecordRepository = rentRecordRepository;
    }

    public DashboardSummary getDashboardSummary() {

        DashboardSummary summary = new DashboardSummary();

        // -------------------------
        // ROOM INFORMATION
        // -------------------------

        List<Room> rooms = roomRepository.findAll();

        long totalRooms = rooms.size();

        long totalBeds = rooms.stream()
                .mapToLong(Room::getCapacity)
                .sum();

        long occupiedBeds = rooms.stream()
                .mapToLong(Room::getOccupiedBeds)
                .sum();

        long availableBeds = totalBeds - occupiedBeds;

        long fullRooms = rooms.stream()
                .filter(room ->
                        room.getOccupiedBeds() >= room.getCapacity())
                .count();

        // -------------------------
        // TENANT INFORMATION
        // -------------------------

        long totalTenants = tenantRepository.count();

        // -------------------------
        // RENT INFORMATION
        // -------------------------

        List<RentRecord> rentRecords =
                rentRecordRepository.findAll();

        long paidTenants = rentRecords.stream()
                .filter(rent ->
                        "PAID".equalsIgnoreCase(rent.getStatus()))
                .count();

        long pendingTenants = rentRecords.stream()
                .filter(rent ->
                        "PENDING".equalsIgnoreCase(rent.getStatus()))
                .count();

        LocalDate today = LocalDate.now();

        long overdueTenants = rentRecords.stream()
                .filter(rent ->
                        "PENDING".equalsIgnoreCase(rent.getStatus())
                        && rent.getDueDate() != null
                        && rent.getDueDate().isBefore(today))
                .count();

        double totalRentExpected = rentRecords.stream()
                .mapToDouble(RentRecord::getRentAmount)
                .sum();

        double totalRentReceived = rentRecords.stream()
                .filter(rent ->
                        "PAID".equalsIgnoreCase(rent.getStatus()))
                .mapToDouble(RentRecord::getRentAmount)
                .sum();

        double totalOutstanding =
                totalRentExpected - totalRentReceived;

        // -------------------------
        // SET DASHBOARD VALUES
        // -------------------------

        summary.setTotalRooms(totalRooms);
        summary.setTotalTenants(totalTenants);

        summary.setTotalBeds(totalBeds);
        summary.setOccupiedBeds(occupiedBeds);
        summary.setAvailableBeds(availableBeds);
        summary.setFullRooms(fullRooms);

        summary.setPaidTenants(paidTenants);
        summary.setPendingTenants(pendingTenants);
        summary.setOverdueTenants(overdueTenants);

        summary.setTotalRentExpected(totalRentExpected);
        summary.setTotalRentReceived(totalRentReceived);
        summary.setTotalOutstanding(totalOutstanding);

        return summary;
    }
}

