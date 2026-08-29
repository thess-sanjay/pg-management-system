package com.pgms.pgmanagementsystem.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pgms.pgmanagementsystem.entity.RentRecord;

public interface RentRecordRepository extends JpaRepository<RentRecord, Long> {

    List<RentRecord> findByStatus(String status);

    List<RentRecord> findByTenantId(Long tenantId);

    boolean existsByTenantIdAndMonth(Long tenantId, String month);

    List<RentRecord> findByMonth(String month);
    
    List<RentRecord> findByDueDateAndStatus(
            LocalDate dueDate,
            String status
    );
   
}