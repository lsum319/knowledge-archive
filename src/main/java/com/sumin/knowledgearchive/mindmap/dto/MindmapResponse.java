package com.sumin.knowledgearchive.mindmap.dto;

import com.sumin.knowledgearchive.mindmap.MindmapDomain;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MindmapResponse {
    private int id;
    private String name;
    private int userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MindmapResponse from(MindmapDomain domain) {
        MindmapResponse response = new MindmapResponse();
        response.setId(domain.getId());
        response.setName(domain.getName());
        response.setUserId(domain.getUserId());
        response.setCreatedAt(domain.getCreatedAt());
        response.setUpdatedAt(domain.getUpdatedAt());
        return response;
    }
}
