
package com.pgms.pgmanagementsystem.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler handler;

    @BeforeEach
    void setUp() {
        handler = new GlobalExceptionHandler();
    }


    // ---------------------------------------------------------
    // 1. ROOM NOT FOUND
    // ---------------------------------------------------------

    @Test
    void handleRoomNotFound_ShouldReturn404() {

        RoomNotFoundException exception =
                new RoomNotFoundException(
                        "Room not found with ID: 99"
                );

        ResponseEntity<Map<String, Object>> response =
                handler.handleRoomNotFound(exception);

        assertEquals(
                HttpStatus.NOT_FOUND,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                404,
                response.getBody().get("status")
        );

        assertEquals(
                "Room not found with ID: 99",
                response.getBody().get("message")
        );
    }


    // ---------------------------------------------------------
    // 2. ROOM FULL
    // ---------------------------------------------------------

    @Test
    void handleRoomFull_ShouldReturn400() {

        RoomFullException exception =
                new RoomFullException(
                        "Room 101 is full"
                );

        ResponseEntity<Map<String, Object>> response =
                handler.handleRoomFull(exception);

        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                400,
                response.getBody().get("status")
        );

        assertEquals(
                "Room 101 is full",
                response.getBody().get("message")
        );
    }


    // ---------------------------------------------------------
    // 3. TENANT NOT FOUND
    // ---------------------------------------------------------

    @Test
    void handleTenantNotFound_ShouldReturn404() {

        TenantNotFoundException exception =
                new TenantNotFoundException(
                        "Tenant not found with ID: 99"
                );

        ResponseEntity<Map<String, Object>> response =
                handler.handleTenantNotFound(exception);

        assertEquals(
                HttpStatus.NOT_FOUND,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                404,
                response.getBody().get("status")
        );

        assertEquals(
                "Tenant not found with ID: 99",
                response.getBody().get("message")
        );
    }


    // ---------------------------------------------------------
    // 4. ROOM VALIDATION
    // ---------------------------------------------------------

    @Test
    void handleRoomValidation_ShouldReturn400() {

        RoomValidationException exception =
                new RoomValidationException(
                        "Occupied beds cannot be greater than room capacity"
                );

        ResponseEntity<Map<String, Object>> response =
                handler.handleRoomValidation(exception);

        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                400,
                response.getBody().get("status")
        );

        assertEquals(
                "Occupied beds cannot be greater than room capacity",
                response.getBody().get("message")
        );
    }


    // ---------------------------------------------------------
    // 5. VALIDATION ERRORS
    // ---------------------------------------------------------

    @Test
    void handleValidationErrors_ShouldReturn400WithFieldErrors() {

        MethodArgumentNotValidException exception =
                mock(MethodArgumentNotValidException.class);

        BindingResult bindingResult =
                mock(BindingResult.class);

        FieldError nameError =
                new FieldError(
                        "tenant",
                        "name",
                        "Name is required"
                );

        FieldError phoneError =
                new FieldError(
                        "tenant",
                        "phone",
                        "Phone is required"
                );

        when(exception.getBindingResult())
                .thenReturn(bindingResult);

        when(bindingResult.getFieldErrors())
                .thenReturn(
                        java.util.List.of(
                                nameError,
                                phoneError
                        )
                );

        ResponseEntity<Map<String, Object>> response =
                handler.handleValidationErrors(exception);

        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                400,
                response.getBody().get("status")
        );

        @SuppressWarnings("unchecked")
        Map<String, String> errors =
                (Map<String, String>)
                        response.getBody().get("errors");

        assertNotNull(errors);

        assertEquals(
                "Name is required",
                errors.get("name")
        );

        assertEquals(
                "Phone is required",
                errors.get("phone")
        );
    }


    // ---------------------------------------------------------
    // 6. DUPLICATE TENANT
    // ---------------------------------------------------------

    @Test
    void handleDuplicateTenant_ShouldReturn409() {

        DuplicateTenantException exception =
                new DuplicateTenantException(
                        "Tenant with phone number 9876543210 already exists"
                );

        ResponseEntity<Map<String, Object>> response =
                handler.handleDuplicateTenant(exception);

        assertEquals(
                HttpStatus.CONFLICT,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                409,
                response.getBody().get("status")
        );

        assertEquals(
                "Tenant with phone number 9876543210 already exists",
                response.getBody().get("message")
        );
    }


    // ---------------------------------------------------------
    // 7. ROOM HAS TENANTS
    // ---------------------------------------------------------

    @Test
    void handleRoomHasTenants_ShouldReturn400() {

        RoomHasTenantsException exception =
                new RoomHasTenantsException(
                        "Cannot delete room 101 because it has 2 tenant(s)"
                );

        ResponseEntity<Map<String, Object>> response =
                handler.handleRoomHasTenants(exception);

        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                400,
                response.getBody().get("status")
        );

        assertEquals(
                "Cannot delete room 101 because it has 2 tenant(s)",
                response.getBody().get("message")
        );
    }


    // ---------------------------------------------------------
    // 8. DUPLICATE RENT
    // ---------------------------------------------------------

    @Test
    void handleDuplicateRent_ShouldReturn409() {

        DuplicateRentException exception =
                new DuplicateRentException(
                        "Rent record already exists for tenant ID 14"
                );

        ResponseEntity<Map<String, Object>> response =
                handler.handleDuplicateRent(exception);

        assertEquals(
                HttpStatus.CONFLICT,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                409,
                response.getBody().get("status")
        );

        assertEquals(
                "Rent record already exists for tenant ID 14",
                response.getBody().get("message")
        );
    }


    // ---------------------------------------------------------
    // 9. RENT NOT FOUND
    // ---------------------------------------------------------

    @Test
    void handleRentNotFound_ShouldReturn404() {

        RentNotFoundException exception =
                new RentNotFoundException(
                        "Rent record not found with ID: 99"
                );

        ResponseEntity<Map<String, Object>> response =
                handler.handleRentNotFound(exception);

        assertEquals(
                HttpStatus.NOT_FOUND,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                404,
                response.getBody().get("status")
        );

        assertEquals(
                "Rent record not found with ID: 99",
                response.getBody().get("message")
        );
    }


    // ---------------------------------------------------------
    // 10. RENT VALIDATION
    // ---------------------------------------------------------

    @Test
    void handleRentValidation_ShouldReturn400() {

        RentValidationException exception =
                new RentValidationException(
                        "Invalid rent status. Use PAID or PENDING"
                );

        ResponseEntity<Map<String, Object>> response =
                handler.handleRentValidation(exception);

        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                400,
                response.getBody().get("status")
        );

        assertEquals(
                "Invalid rent status. Use PAID or PENDING",
                response.getBody().get("message")
        );
    }
}

