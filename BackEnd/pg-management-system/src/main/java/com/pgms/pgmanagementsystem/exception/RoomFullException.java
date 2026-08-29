package com.pgms.pgmanagementsystem.exception;

public class RoomFullException extends RuntimeException {

    public RoomFullException(String message) {
        super(message);
    }
}