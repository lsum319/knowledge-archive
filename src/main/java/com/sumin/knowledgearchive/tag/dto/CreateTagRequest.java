package com.sumin.knowledgearchive.tag.dto;

import com.sumin.knowledgearchive.tag.TagDomain;
import lombok.Data;

@Data
public class CreateTagRequest {
    private String name;

    public TagDomain toDomain(){
        TagDomain domain = new TagDomain();
        domain.setName(name);
        return domain;
    }
}
