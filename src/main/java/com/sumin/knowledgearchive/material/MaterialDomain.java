package com.sumin.knowledgearchive.material;

import com.sumin.knowledgearchive.tag.TagDomain;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class MaterialDomain {
    private int id;
    private String title;
    private String memo;
    private String url;
    private List<TagDomain> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int userId;
}
