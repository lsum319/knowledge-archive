package com.sumin.knowledgearchive.material.dto;

import com.sumin.knowledgearchive.material.MaterialDomain;
import com.sumin.knowledgearchive.tag.TagDomain;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class MaterialResponse {

    private int id;

    private String title;

    private String memo;

    private String url;

    private List<TagDomain> tags;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private int userId;

    public static MaterialResponse from(MaterialDomain domain) {
        if (domain == null) {
            System.out.println("db에 조회된 값이 없습니다.");
            return null;
        }
        MaterialResponse response = new MaterialResponse();

        response.setId(domain.getId());
        response.setTitle(domain.getTitle());
        response.setMemo(domain.getMemo());
        response.setUrl(domain.getUrl());
        response.setTags(domain.getTags());
        response.setCreatedAt(domain.getCreatedAt());
        response.setUpdatedAt(domain.getUpdatedAt());
        response.setUserId(domain.getUserId());

        return response;
    }
}