
package com.pgms.pgmanagementsystem.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.pgms.pgmanagementsystem.dto.RentSummary;
import com.pgms.pgmanagementsystem.entity.RentRecord;
import com.pgms.pgmanagementsystem.entity.Tenant;
import com.pgms.pgmanagementsystem.exception.DuplicateRentException;
import com.pgms.pgmanagementsystem.exception.RentNotFoundException;
import com.pgms.pgmanagementsystem.exception.RentValidationException;
import com.pgms.pgmanagementsystem.exception.TenantNotFoundException;
import com.pgms.pgmanagementsystem.repository.RentRecordRepository;
import com.pgms.pgmanagementsystem.repository.TenantRepository;

@ExtendWith(MockitoExtension.class)
class RentRecordServiceTest {

    @Mock
    private RentRecordRepository rentRecordRepository;

    @Mock
    private TenantRepository tenantRepository;

    @InjectMocks
    private RentRecordService rentRecordService;

    private Tenant tenant1;
    private Tenant tenant2;

    private RentRecord rent1;
    private RentRecord rent2;


    @BeforeEach
    void setUp() {

        tenant1 = new Tenant();
        tenant1.setId(1L);
        tenant1.setName("Arun Kumar");
        tenant1.setPhone("9876543210");
        tenant1.setEmail("arun@gmail.com");
        tenant1.setJoiningDate(LocalDate.of(2026, 8, 1));

        tenant2 = new Tenant();
        tenant2.setId(2L);
        tenant2.setName("Karthik");
        tenant2.setPhone("9876543211");
        tenant2.setEmail("karthik@gmail.com");
        tenant2.setJoiningDate(LocalDate.of(2026, 8, 10));


        rent1 = new RentRecord();
        rent1.setId(1L);
        rent1.setRentAmount(8000);
        rent1.setMonth("August 2026");
        rent1.setStatus("PENDING");
        rent1.setTenant(tenant1);
        rent1.setDueDate(LocalDate.of(2026, 8, 31));


        rent2 = new RentRecord();
        rent2.setId(2L);
        rent2.setRentAmount(9000);
        rent2.setMonth("August 2026");
        rent2.setStatus("PAID");
        rent2.setTenant(tenant2);
        rent2.setDueDate(LocalDate.of(2026, 9, 9));
        rent2.setPaidDate(LocalDate.of(2026, 8, 25));
    }


    // ---------------------------------------------------------
    // 1. GET ALL RENT RECORDS
    // ---------------------------------------------------------

    @Test
    void getAllRentRecords_ShouldReturnAllRentRecords() {

        List<RentRecord> rents =
                Arrays.asList(rent1, rent2);

        when(rentRecordRepository.findAll())
                .thenReturn(rents);

        List<RentRecord> result =
                rentRecordService.getAllRentRecords();

        assertEquals(2, result.size());
        assertEquals("August 2026", result.get(0).getMonth());
        assertEquals("August 2026", result.get(1).getMonth());
    }


    // ---------------------------------------------------------
    // 2. GET PAID RENT RECORDS
    // ---------------------------------------------------------

    @Test
    void getPaidRentRecords_ShouldReturnPaidRents() {

        when(rentRecordRepository.findByStatus("PAID"))
                .thenReturn(List.of(rent2));

        List<RentRecord> result =
                rentRecordService.getPaidRentRecords();

        assertEquals(1, result.size());
        assertEquals("PAID", result.get(0).getStatus());
        assertEquals("Karthik",
                result.get(0).getTenant().getName());
    }


    // ---------------------------------------------------------
    // 3. GET PENDING RENT RECORDS
    // ---------------------------------------------------------

    @Test
    void getPendingRentRecords_ShouldReturnPendingRents() {

        when(rentRecordRepository.findByStatus("PENDING"))
                .thenReturn(List.of(rent1));

        List<RentRecord> result =
                rentRecordService.getPendingRentRecords();

        assertEquals(1, result.size());
        assertEquals("PENDING", result.get(0).getStatus());
        assertEquals("Arun Kumar",
                result.get(0).getTenant().getName());
    }


    // ---------------------------------------------------------
    // 4. GET RENT HISTORY BY TENANT
    // ---------------------------------------------------------

    @Test
    void getRentRecordsByTenant_WhenTenantExists_ShouldReturnHistory() {

        when(tenantRepository.existsById(1L))
                .thenReturn(true);

        when(rentRecordRepository.findByTenantId(1L))
                .thenReturn(List.of(rent1));

        List<RentRecord> result =
                rentRecordService.getRentRecordsByTenant(1L);

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getTenant().getId());
    }


    // ---------------------------------------------------------
    // 5. TENANT NOT FOUND
    // ---------------------------------------------------------

    @Test
    void getRentRecordsByTenant_WhenTenantDoesNotExist_ShouldThrowException() {

        when(tenantRepository.existsById(99L))
                .thenReturn(false);

        assertThrows(
                TenantNotFoundException.class,
                () -> rentRecordService.getRentRecordsByTenant(99L)
        );

        verify(rentRecordRepository, never())
                .findByTenantId(99L);
    }


    // ---------------------------------------------------------
    // 6. CREATE RENT SUCCESSFULLY
    // ---------------------------------------------------------

    @Test
    void saveRentRecord_WhenValid_ShouldSaveRent() {

        RentRecord rent = new RentRecord();

        rent.setRentAmount(8000);
        rent.setMonth("September 2026");
        rent.setStatus("PENDING");

        Tenant tenantReference = new Tenant();
        tenantReference.setId(1L);

        rent.setTenant(tenantReference);

        when(tenantRepository.findById(1L))
                .thenReturn(Optional.of(tenant1));

        when(rentRecordRepository.existsByTenantIdAndMonth(
                1L, "September 2026"))
                .thenReturn(false);

        when(rentRecordRepository.save(rent))
                .thenReturn(rent);

        RentRecord result =
                rentRecordService.saveRentRecord(rent);

        assertEquals(8000, result.getRentAmount());
        assertEquals("September 2026", result.getMonth());
        assertEquals("PENDING", result.getStatus());
        assertEquals(tenant1, result.getTenant());

        verify(rentRecordRepository).save(rent);
    }


    // ---------------------------------------------------------
    // 7. AUTOMATIC DUE DATE
    // ---------------------------------------------------------

    @Test
    void saveRentRecord_WhenDueDateMissing_ShouldCalculateDueDate() {

        RentRecord rent = new RentRecord();

        rent.setRentAmount(8000);
        rent.setMonth("September 2026");
        rent.setStatus("PENDING");

        Tenant tenantReference = new Tenant();
        tenantReference.setId(1L);

        rent.setTenant(tenantReference);

        when(tenantRepository.findById(1L))
                .thenReturn(Optional.of(tenant1));

        when(rentRecordRepository.existsByTenantIdAndMonth(
                1L, "September 2026"))
                .thenReturn(false);

        when(rentRecordRepository.save(rent))
                .thenReturn(rent);

        RentRecord result =
                rentRecordService.saveRentRecord(rent);

        // Joining date = 2026-08-01
        // Due date = joining date + 30 days
        assertEquals(
                LocalDate.of(2026, 8, 31),
                result.getDueDate()
        );
    }


    // ---------------------------------------------------------
    // 8. TENANT ID MISSING
    // ---------------------------------------------------------

    @Test
    void saveRentRecord_WhenTenantIdMissing_ShouldThrowException() {

        RentRecord rent = new RentRecord();

        rent.setRentAmount(8000);
        rent.setMonth("September 2026");
        rent.setStatus("PENDING");

        assertThrows(
                TenantNotFoundException.class,
                () -> rentRecordService.saveRentRecord(rent)
        );

        verify(rentRecordRepository, never())
                .save(rent);
    }


    // ---------------------------------------------------------
    // 9. TENANT DOES NOT EXIST
    // ---------------------------------------------------------

    @Test
    void saveRentRecord_WhenTenantDoesNotExist_ShouldThrowException() {

        RentRecord rent = new RentRecord();

        rent.setRentAmount(8000);
        rent.setMonth("September 2026");
        rent.setStatus("PENDING");

        Tenant tenantReference = new Tenant();
        tenantReference.setId(99L);

        rent.setTenant(tenantReference);

        when(tenantRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                TenantNotFoundException.class,
                () -> rentRecordService.saveRentRecord(rent)
        );

        verify(rentRecordRepository, never())
                .save(rent);
    }


    // ---------------------------------------------------------
    // 10. DUPLICATE MONTHLY RENT
    // ---------------------------------------------------------

    @Test
    void saveRentRecord_WhenDuplicateMonth_ShouldThrowException() {

        RentRecord rent = new RentRecord();

        rent.setRentAmount(8000);
        rent.setMonth("August 2026");
        rent.setStatus("PENDING");

        Tenant tenantReference = new Tenant();
        tenantReference.setId(1L);

        rent.setTenant(tenantReference);

        when(tenantRepository.findById(1L))
                .thenReturn(Optional.of(tenant1));

        when(rentRecordRepository.existsByTenantIdAndMonth(
                1L, "August 2026"))
                .thenReturn(true);

        assertThrows(
                DuplicateRentException.class,
                () -> rentRecordService.saveRentRecord(rent)
        );

        verify(rentRecordRepository, never())
                .save(rent);
    }


    // ---------------------------------------------------------
    // 11. UPDATE RENT TO PAID
    // ---------------------------------------------------------

    @Test
    void updateRentRecord_WhenStatusPaid_ShouldMarkAsPaid() {

        RentRecord existingRent = new RentRecord();

        existingRent.setId(1L);
        existingRent.setRentAmount(8000);
        existingRent.setMonth("August 2026");
        existingRent.setStatus("PENDING");
        existingRent.setTenant(tenant1);

        RentRecord updatedRent = new RentRecord();
        updatedRent.setRentAmount(8000);
        updatedRent.setStatus("PAID");

        when(rentRecordRepository.findById(1L))
                .thenReturn(Optional.of(existingRent));

        when(rentRecordRepository.save(existingRent))
                .thenReturn(existingRent);

        RentRecord result =
                rentRecordService.updateRentRecord(
                        1L, updatedRent);

        assertEquals("PAID", result.getStatus());
        assertEquals(LocalDate.now(), result.getPaidDate());

        verify(rentRecordRepository)
                .save(existingRent);
    }



    // ---------------------------------------------------------
    // 12. UPDATE RENT TO PENDING
    // ---------------------------------------------------------

  
    @Test
    void updateRentRecord_WhenStatusPending_ShouldClearPaidDate() {

        RentRecord existingRent = new RentRecord();

        existingRent.setId(1L);
        existingRent.setRentAmount(8000);
        existingRent.setMonth("August 2026");
        existingRent.setStatus("PAID");
        existingRent.setPaidDate(LocalDate.of(2026, 8, 20));

        RentRecord updatedRent = new RentRecord();
        updatedRent.setRentAmount(8000);
        updatedRent.setStatus("PENDING");

        when(rentRecordRepository.findById(1L))
                .thenReturn(Optional.of(existingRent));

        when(rentRecordRepository.save(existingRent))
                .thenReturn(existingRent);

        RentRecord result =
                rentRecordService.updateRentRecord(
                        1L, updatedRent);

        assertEquals("PENDING", result.getStatus());
        assertEquals(null, result.getPaidDate());
    }
  


    // ---------------------------------------------------------
    // 13. INVALID RENT STATUS
    // ---------------------------------------------------------

    @Test
    void updateRentRecord_WhenInvalidStatus_ShouldThrowException() {

        RentRecord existingRent = new RentRecord();

        existingRent.setId(1L);
        existingRent.setStatus("PENDING");

        RentRecord updatedRent = new RentRecord();
        updatedRent.setStatus("CANCELLED");

        when(rentRecordRepository.findById(1L))
                .thenReturn(Optional.of(existingRent));

        assertThrows(
                RentValidationException.class,
                () -> rentRecordService.updateRentRecord(
                        1L, updatedRent)
        );

        verify(rentRecordRepository, never())
                .save(existingRent);
    }


    // ---------------------------------------------------------
    // 14. RENT RECORD NOT FOUND
    // ---------------------------------------------------------

    @Test
    void updateRentRecord_WhenRentDoesNotExist_ShouldThrowException() {

        RentRecord updatedRent = new RentRecord();
        updatedRent.setStatus("PAID");

        when(rentRecordRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                RentNotFoundException.class,
                () -> rentRecordService.updateRentRecord(
                        99L, updatedRent)
        );
    }


    // ---------------------------------------------------------
    // 15. MONTHLY SUMMARY
    // ---------------------------------------------------------

    @Test
    void getMonthlySummary_ShouldCalculateCorrectSummary() {

        when(rentRecordRepository.findByMonth("August 2026"))
                .thenReturn(Arrays.asList(rent1, rent2));

        RentSummary summary =
                rentRecordService.getMonthlySummary(
                        "August 2026");

        assertEquals("August 2026", summary.getMonth());

        assertEquals(2, summary.getTotalTenants());

        assertEquals(1, summary.getPaidTenants());

        assertEquals(1, summary.getPendingTenants());

        assertEquals(17000,
                summary.getTotalRentExpected());

        assertEquals(9000,
                summary.getTotalRentReceived());

        assertEquals(8000,
                summary.getTotalOutstanding());

        assertEquals(
                List.of("Arun Kumar"),
                summary.getPendingTenantNames()
        );

        assertEquals(
                List.of("Karthik"),
                summary.getPaidTenantNames()
        );
    }


    // ---------------------------------------------------------
    // 16. GET RENTS BY STATUS
    // ---------------------------------------------------------

    @Test
    void getRentsByStatus_WhenPaid_ShouldReturnPaidRents() {

        when(rentRecordRepository.findByStatus("PAID"))
                .thenReturn(List.of(rent2));

        List<RentRecord> result =
                rentRecordService.getRentsByStatus("PAID");

        assertEquals(1, result.size());
        assertEquals("PAID", result.get(0).getStatus());
    }


    // ---------------------------------------------------------
    // 17. INVALID STATUS FILTER
    // ---------------------------------------------------------

    @Test
    void getRentsByStatus_WhenInvalidStatus_ShouldThrowException() {

        assertThrows(
                IllegalArgumentException.class,
                () -> rentRecordService.getRentsByStatus(
                        "CANCELLED")
        );

        verify(rentRecordRepository, never())
                .findByStatus("CANCELLED");
    }


    // ---------------------------------------------------------
    // 18. OVERDUE RENT
    // ---------------------------------------------------------

    @Test
    void getOverdueRentRecords_ShouldReturnOverduePendingRents() {

        RentRecord overdueRent = new RentRecord();

        overdueRent.setId(3L);
        overdueRent.setRentAmount(8000);
        overdueRent.setMonth("July 2026");
        overdueRent.setStatus("PENDING");
        overdueRent.setTenant(tenant1);

        // A date before today
        overdueRent.setDueDate(
                LocalDate.now().minusDays(5)
        );

        RentRecord futureRent = new RentRecord();

        futureRent.setId(4L);
        futureRent.setRentAmount(8000);
        futureRent.setMonth("September 2026");
        futureRent.setStatus("PENDING");
        futureRent.setTenant(tenant2);

        futureRent.setDueDate(
                LocalDate.now().plusDays(5)
        );

        when(rentRecordRepository.findByStatus("PENDING"))
                .thenReturn(Arrays.asList(
                        overdueRent,
                        futureRent
                ));

        List<RentRecord> result =
                rentRecordService.getOverdueRentRecords();

        assertEquals(1, result.size());

        assertEquals(
                overdueRent,
                result.get(0)
        );
    }


    // ---------------------------------------------------------
    // 19. PAID RENT SHOULD NOT BE OVERDUE
    // ---------------------------------------------------------

    @Test
    void getOverdueRentRecords_ShouldIgnorePaidRent() {

        RentRecord paidRent = new RentRecord();

        paidRent.setId(5L);
        paidRent.setRentAmount(8000);
        paidRent.setMonth("July 2026");
        paidRent.setStatus("PAID");
        paidRent.setTenant(tenant1);

        paidRent.setDueDate(
                LocalDate.now().minusDays(5)
        );

        // Service only searches PENDING records
        when(rentRecordRepository.findByStatus("PENDING"))
                .thenReturn(List.of());

        List<RentRecord> result =
                rentRecordService.getOverdueRentRecords();

        assertEquals(0, result.size());
    }
}

