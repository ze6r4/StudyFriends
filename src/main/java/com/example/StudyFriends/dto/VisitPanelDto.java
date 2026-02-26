package com.example.StudyFriends.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class VisitPanelDto {

    private List<FriendDto> visit;
    private List<FriendDto> notVisit;

}