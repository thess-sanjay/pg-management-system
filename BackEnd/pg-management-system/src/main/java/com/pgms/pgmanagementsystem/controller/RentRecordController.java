
package com.pgms.pgmanagementsystem.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pgms.pgmanagementsystem.dto.RentSummary;
import com.pgms.pgmanagementsystem.entity.RentRecord;
import com.pgms.pgmanagementsystem.service.RentRecordService;

@RestController
@RequestMapping("/api/rents")
public class RentRecordController {

    private final RentRecordService rentRecordService;

    public RentRecordController(RentRecordService rentRecordService) {
        this.rentRecordService = rentRecordService;
    }

    // Get all rent records
    @GetMapping
    public List<RentRecord> getAllRentRecords() {
        return rentRecordService.getAllRentRecords();
    }

    // Get paid rent records
    @GetMapping("/paid")
    public List<RentRecord> getPaidRentRecords() {
        return rentRecordService.getPaidRentRecords();
    }

    // Get pending rent records
    @GetMapping("/pending")
    public List<RentRecord> getPendingRentRecords() {
        return rentRecordService.getPendingRentRecords();
    }

    // Get rent history of a tenant
    @GetMapping("/tenant/{tenantId}")
    public List<RentRecord> getRentRecordsByTenant(
            @PathVariable Long tenantId) {

        return rentRecordService.getRentRecordsByTenant(tenantId);
    }

    // Create rent record
    @PostMapping
    public RentRecord createRentRecord(
            @RequestBody RentRecord rentRecord) {

        return rentRecordService.saveRentRecord(rentRecord);
    }

    // Update rent record
    @PutMapping("/{id}")
    public RentRecord updateRentRecord(
            @PathVariable Long id,
            @RequestBody RentRecord rentRecord) {

        return rentRecordService.updateRentRecord(id, rentRecord);
    }

    // Get monthly rent summary
    @GetMapping("/summary/{month}")
    public RentSummary getMonthlySummary(
            @PathVariable String month) {

        return rentRecordService.getMonthlySummary(month);
    }

    // Get rent records by status
    @GetMapping("/status/{status}")
    public List<RentRecord> getRentsByStatus(
            @PathVariable String status) {

        return rentRecordService.getRentsByStatus(status);
    }
    
    @GetMapping("/overdue")
    public List<RentRecord> getOverdueRentRecords() {

        return rentRecordService.getOverdueRentRecords();
    }
    
    
    @GetMapping("/due-today")
    public List<RentRecord> getTodayDueRentRecords() {

        return rentRecordService.getTodayDueRentRecords();
    }
}

