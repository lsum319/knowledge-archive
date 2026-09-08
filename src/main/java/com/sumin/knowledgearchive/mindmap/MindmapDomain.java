package com.sumin.knowledgearchive.mindmap;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MindmapDomain {
    private int id;
    private String name;
    private int userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
