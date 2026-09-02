package com.sumin.knowledgearchive.tag.dto;

import com.sumin.knowledgearchive.tag.TagDomain;
import lombok.Data;

@Data
public class CreateTagRequest {
    private String name;
    private int userId;

    public TagDomain toDomain(){
        TagDomain domain = new TagDomain();
        domain.setName(name);
        domain.setUserId(userId);
        return domain;
    }
}
