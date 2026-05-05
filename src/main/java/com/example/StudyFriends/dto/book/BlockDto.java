package com.example.StudyFriends.dto.book;

import lombok.Data;

@Data
public class BlockDto {
    private PageType type;

    private String title;        // заголовок (день / месяц / неделя)
    private Object data;

    private String pageCovering; // FULL / FLOW
}