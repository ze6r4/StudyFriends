package com.example.StudyFriends.exceptions;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, Long id) {
        super(resource + " с ID " + id + " не найден");
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }
}