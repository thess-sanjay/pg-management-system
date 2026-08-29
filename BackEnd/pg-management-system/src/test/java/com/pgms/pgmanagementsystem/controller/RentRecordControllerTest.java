
package com.pgms.pgmanagementsystem.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import com.pgms.pgmanagementsystem.dto.RentSummary;
import com.pgms.pgmanagementsystem.entity.RentRecord;
import com.pgms.pgmanagementsystem.entity.Tenant;
import com.pgms.pgmanagementsystem.service.RentRecordService;

@ExtendWith(MockitoExtension.class)
class RentRecordControllerTest {

    @Mock
    private RentRecordService rentRecordService;

    @InjectMocks
    private RentRecordController rentRecordController;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    private RentRecord rentRecord;

    private Tenant tenant;


    @BeforeEach
    void setUp() {

        mockMvc = MockMvcBuilders
                .standaloneSetup(rentRecordController)
                .build();

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        tenant = new Tenant();

        tenant.setId(14L);
        tenant.setName("Arun Kumar");
        tenant.setPhone("9876543210");
        tenant.setEmail("arun@gmail.com");
        tenant.setJoiningDate(
                LocalDate.of(2026, 8, 1)
        );

        rentRecord = new RentRecord();

        rentRecord.setId(1L);
        rentRecord.setRentAmount(8000);
        rentRecord.setMonth("August 2026");
        rentRecord.setStatus("PENDING");
        rentRecord.setDueDate(
                LocalDate.of(2026, 8, 31)
        );
        rentRecord.setPaidDate(null);
        rentRecord.setTenant(tenant);
    }


    // ---------------------------------------------------------
    // 1. GET ALL RENT RECORDS
    // ---------------------------------------------------------

    @Test
    void getAllRentRecords_ShouldReturnAllRents()
            throws Exception {

        when(rentRecordService.getAllRentRecords())
                .thenReturn(List.of(rentRecord));

        mockMvc.perform(
                get("/api/rents")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].rentAmount")
                .value(8000.0))
        .andExpect(jsonPath("$[0].month")
                .value("August 2026"))
        .andExpect(jsonPath("$[0].status")
                .value("PENDING"));

        verify(rentRecordService)
                .getAllRentRecords();
    }


    // ---------------------------------------------------------
    // 2. GET PAID RENT RECORDS
    // ---------------------------------------------------------

    @Test
    void getPaidRentRecords_ShouldReturnPaidRents()
            throws Exception {

        RentRecord paidRent = rentRecord;

        paidRent.setStatus("PAID");
        paidRent.setPaidDate(
                LocalDate.of(2026, 8, 25)
        );

        when(rentRecordService.getPaidRentRecords())
                .thenReturn(List.of(paidRent));

        mockMvc.perform(
                get("/api/rents/paid")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].status")
                .value("PAID"))
        .andExpect(jsonPath("$[0].paidDate")
                .value("2026-08-25"));

        verify(rentRecordService)
                .getPaidRentRecords();
    }


    // ---------------------------------------------------------
    // 3. GET PENDING RENT RECORDS
    // ---------------------------------------------------------

    @Test
    void getPendingRentRecords_ShouldReturnPendingRents()
            throws Exception {

        when(rentRecordService.getPendingRentRecords())
                .thenReturn(List.of(rentRecord));

        mockMvc.perform(
                get("/api/rents/pending")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].status")
                .value("PENDING"));

        verify(rentRecordService)
                .getPendingRentRecords();
    }


    // ---------------------------------------------------------
    // 4. GET RENT HISTORY BY TENANT
    // ---------------------------------------------------------

    @Test
    void getRentRecordsByTenant_ShouldReturnTenantHistory()
            throws Exception {

        when(rentRecordService.getRentRecordsByTenant(14L))
                .thenReturn(List.of(rentRecord));

        mockMvc.perform(
                get("/api/rents/tenant/14")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].tenant.id")
                .value(14))
        .andExpect(jsonPath("$[0].tenant.name")
                .value("Arun Kumar"));

        verify(rentRecordService)
                .getRentRecordsByTenant(14L);
    }


    // ---------------------------------------------------------
    // 5. CREATE RENT RECORD
    // ---------------------------------------------------------

    @Test
    void createRentRecord_ShouldCreateRent()
            throws Exception {

        when(rentRecordService.saveRentRecord(
                any(RentRecord.class)))
                .thenReturn(rentRecord);

        mockMvc.perform(
                post("/api/rents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                objectMapper.writeValueAsString(
                                        rentRecord
                                )
                        )
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.rentAmount")
                .value(8000.0))
        .andExpect(jsonPath("$.month")
                .value("August 2026"))
        .andExpect(jsonPath("$.status")
                .value("PENDING"))
        .andExpect(jsonPath("$.dueDate")
                .value("2026-08-31"));

        verify(rentRecordService)
                .saveRentRecord(any(RentRecord.class));
    }


    // ---------------------------------------------------------
    // 6. UPDATE RENT RECORD
    // ---------------------------------------------------------

    @Test
    void updateRentRecord_ShouldUpdateRent()
            throws Exception {

        RentRecord updatedRent = new RentRecord();

        updatedRent.setId(1L);
        updatedRent.setRentAmount(8000);
        updatedRent.setMonth("August 2026");
        updatedRent.setStatus("PAID");
        updatedRent.setPaidDate(
                LocalDate.of(2026, 8, 25)
        );
        updatedRent.setDueDate(
                LocalDate.of(2026, 8, 31)
        );
        updatedRent.setTenant(tenant);

        when(rentRecordService.updateRentRecord(
                eq(1L),
                any(RentRecord.class)))
                .thenReturn(updatedRent);

        mockMvc.perform(
                put("/api/rents/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                objectMapper.writeValueAsString(
                                        updatedRent
                                )
                        )
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.status")
                .value("PAID"))
        .andExpect(jsonPath("$.paidDate")
                .value("2026-08-25"));

        verify(rentRecordService)
                .updateRentRecord(
                        eq(1L),
                        any(RentRecord.class)
                );
    }


    // ---------------------------------------------------------
    // 7. GET MONTHLY SUMMARY
    // ---------------------------------------------------------
    @Test
    void getMonthlySummary_ShouldReturnSummary()
            throws Exception {

        RentSummary summary = new RentSummary();

        summary.setMonth("August 2026");
        summary.setTotalTenants(2);
        summary.setPaidTenants(1);
        summary.setPendingTenants(1);
        summary.setTotalRentExpected(16000);
        summary.setTotalRentReceived(8000);
        summary.setTotalOutstanding(8000);

        summary.setPaidTenantNames(
                List.of("Arun Kumar")
        );

        summary.setPendingTenantNames(
                List.of("Karthik")
        );

        when(rentRecordService.getMonthlySummary(
                "August 2026"))
                .thenReturn(summary);

        mockMvc.perform(
                get("/api/rents/summary/{month}", "August 2026")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.month")
                .value("August 2026"))
        .andExpect(jsonPath("$.totalTenants")
                .value(2))
        .andExpect(jsonPath("$.paidTenants")
                .value(1))
        .andExpect(jsonPath("$.pendingTenants")
                .value(1))
        .andExpect(jsonPath("$.totalRentExpected")
                .value(16000.0))
        .andExpect(jsonPath("$.totalRentReceived")
                .value(8000.0))
        .andExpect(jsonPath("$.totalOutstanding")
                .value(8000.0));

        verify(rentRecordService)
                .getMonthlySummary("August 2026");
    }
    // ---------------------------------------------------------
    // 8. GET RENT RECORDS BY STATUS
    // ---------------------------------------------------------

    @Test
    void getRentsByStatus_ShouldReturnMatchingRents()
            throws Exception {

        when(rentRecordService.getRentsByStatus("PAID"))
                .thenReturn(List.of(rentRecord));

        mockMvc.perform(
                get("/api/rents/status/PAID")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$.length()").value(1));

        verify(rentRecordService)
                .getRentsByStatus("PAID");
    }


    // ---------------------------------------------------------
    // 9. GET OVERDUE RENT RECORDS
    // ---------------------------------------------------------

    @Test
    void getOverdueRentRecords_ShouldReturnOverdueRents()
            throws Exception {

        RentRecord overdueRent = new RentRecord();

        overdueRent.setId(1L);
        overdueRent.setRentAmount(8000);
        overdueRent.setMonth("August 2026");
        overdueRent.setStatus("PENDING");
        overdueRent.setDueDate(
                LocalDate.of(2026, 8, 1)
        );
        overdueRent.setTenant(tenant);

        when(rentRecordService.getOverdueRentRecords())
                .thenReturn(List.of(overdueRent));

        mockMvc.perform(
                get("/api/rents/overdue")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].status")
                .value("PENDING"))
        .andExpect(jsonPath("$[0].dueDate")
                .value("2026-08-01"));

        verify(rentRecordService)
                .getOverdueRentRecords();
    }
}

