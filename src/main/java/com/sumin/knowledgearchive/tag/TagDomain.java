package com.sumin.knowledgearchive.tag;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TagDomain {
    private int id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
