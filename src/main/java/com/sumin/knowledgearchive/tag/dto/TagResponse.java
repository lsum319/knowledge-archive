package com.sumin.knowledgearchive.tag.dto;

import com.sumin.knowledgearchive.tag.TagDomain;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TagResponse {
    private int id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TagResponse from(TagDomain domain) {
        if (domain == null){
            System.out.println("db에 조회된 값이 없습니다.");
            return null;
        }
        TagResponse response = new TagResponse();

        response.setId(domain.getId());
        response.setName(domain.getName());
        response.setCreatedAt(domain.getCreatedAt());
        response.setUpdatedAt(domain.getUpdatedAt());

        return response;
    }
}
