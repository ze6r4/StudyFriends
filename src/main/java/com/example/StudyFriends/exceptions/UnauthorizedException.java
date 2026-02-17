package com.example.StudyFriends.exceptions;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException() {
        super("Требуется авторизация");
    }
}

