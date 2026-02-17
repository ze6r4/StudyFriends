package com.example.StudyFriends.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerDto {
    private Long id;
    private String name;
    private String password;
    private String email;
    private Integer coins;
}
