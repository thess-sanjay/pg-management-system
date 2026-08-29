
package com.pgms.pgmanagementsystem.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

import com.pgms.pgmanagementsystem.entity.Room;
import com.pgms.pgmanagementsystem.service.RoomService;

@ExtendWith(MockitoExtension.class)
class RoomControllerTest {

    @Mock
    private RoomService roomService;

    @InjectMocks
    private RoomController roomController;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    private Room room;


    @BeforeEach
    void setUp() {

        mockMvc = MockMvcBuilders
                .standaloneSetup(roomController)
                .build();

        objectMapper = new ObjectMapper();

        room = new Room();

        room.setId(1L);
        room.setRoomNumber("101");
        room.setCapacity(4);
        room.setOccupiedBeds(2);
    }


    // ---------------------------------------------------------
    // 1. GET ALL ROOMS
    // ---------------------------------------------------------

    @Test
    void getAllRooms_ShouldReturnAllRooms() throws Exception {

        when(roomService.getAllRooms())
                .thenReturn(List.of(room));

        mockMvc.perform(
                get("/api/rooms")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].roomNumber").value("101"))
        .andExpect(jsonPath("$[0].capacity").value(4))
        .andExpect(jsonPath("$[0].occupiedBeds").value(2));

        verify(roomService).getAllRooms();
    }


    // ---------------------------------------------------------
    // 2. GET AVAILABLE ROOMS
    // ---------------------------------------------------------

    @Test
    void getAvailableRooms_ShouldReturnAvailableRooms()
            throws Exception {

        when(roomService.getAvailableRooms())
                .thenReturn(List.of(room));

        mockMvc.perform(
                get("/api/rooms/available")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].roomNumber")
                .value("101"));

        verify(roomService)
                .getAvailableRooms();
    }


    // ---------------------------------------------------------
    // 3. GET FULL ROOMS
    // ---------------------------------------------------------

    @Test
    void getFullRooms_ShouldReturnFullRooms()
            throws Exception {

        Room fullRoom = new Room();

        fullRoom.setId(2L);
        fullRoom.setRoomNumber("102");
        fullRoom.setCapacity(4);
        fullRoom.setOccupiedBeds(4);

        when(roomService.getFullRooms())
                .thenReturn(List.of(fullRoom));

        mockMvc.perform(
                get("/api/rooms/full")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].roomNumber")
                .value("102"))
        .andExpect(jsonPath("$[0].capacity")
                .value(4))
        .andExpect(jsonPath("$[0].occupiedBeds")
                .value(4));

        verify(roomService)
                .getFullRooms();
    }


    // ---------------------------------------------------------
    // 4. CREATE ROOM
    // ---------------------------------------------------------

    @Test
    void createRoom_ShouldCreateRoom()
            throws Exception {

        when(roomService.saveRoom(any(Room.class)))
                .thenReturn(room);

        mockMvc.perform(
                post("/api/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                objectMapper.writeValueAsString(room)
                        )
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.roomNumber")
                .value("101"))
        .andExpect(jsonPath("$.capacity")
                .value(4))
        .andExpect(jsonPath("$.occupiedBeds")
                .value(2));

        verify(roomService)
                .saveRoom(any(Room.class));
    }


    // ---------------------------------------------------------
    // 5. GET ROOM BY ID
    // ---------------------------------------------------------

    @Test
    void getRoomById_ShouldReturnRoom()
            throws Exception {

        when(roomService.getRoomById(1L))
                .thenReturn(room);

        mockMvc.perform(
                get("/api/rooms/1")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.roomNumber")
                .value("101"))
        .andExpect(jsonPath("$.capacity")
                .value(4));

        verify(roomService)
                .getRoomById(1L);
    }


    // ---------------------------------------------------------
    // 6. UPDATE ROOM
    // ---------------------------------------------------------

    @Test
    void updateRoom_ShouldUpdateRoom()
            throws Exception {

        Room updatedRoom = new Room();

        updatedRoom.setId(1L);
        updatedRoom.setRoomNumber("101A");
        updatedRoom.setCapacity(6);
        updatedRoom.setOccupiedBeds(3);

        when(roomService.updateRoom(
                any(Long.class),
                any(Room.class)))
                .thenReturn(updatedRoom);

        mockMvc.perform(
                put("/api/rooms/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                objectMapper.writeValueAsString(
                                        updatedRoom
                                )
                        )
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.roomNumber")
                .value("101A"))
        .andExpect(jsonPath("$.capacity")
                .value(6))
        .andExpect(jsonPath("$.occupiedBeds")
                .value(3));

        verify(roomService)
                .updateRoom(
                        any(Long.class),
                        any(Room.class)
                );
    }


    // ---------------------------------------------------------
    // 7. DELETE ROOM
    // ---------------------------------------------------------

    @Test
    void deleteRoom_ShouldDeleteRoom()
            throws Exception {

        doNothing()
                .when(roomService)
                .deleteRoom(1L);

        mockMvc.perform(
                delete("/api/rooms/1")
        )
        .andExpect(status().isOk())
        .andExpect(
                jsonPath("$")
                        .value("Room deleted successfully")
        );

        verify(roomService)
                .deleteRoom(1L);
    }
}

