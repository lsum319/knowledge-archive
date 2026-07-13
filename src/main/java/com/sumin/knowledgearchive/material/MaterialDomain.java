package com.sumin.knowledgearchive.material;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MaterialDomain {
    private int id;
    private String title;
    private String memo;
    private String url;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int userId;
}
