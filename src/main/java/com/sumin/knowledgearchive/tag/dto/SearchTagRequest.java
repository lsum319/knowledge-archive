package com.sumin.knowledgearchive.tag.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SearchTagRequest {
    private int id;
    private String name;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
