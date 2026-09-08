package com.sumin.knowledgearchive.mindmap.dto;

import com.sumin.knowledgearchive.mindmap.MindmapDomain;
import lombok.Data;

@Data
public class CreateMindmapRequest {
    private String name;
    private int userId;

    public MindmapDomain toDomain(){
        MindmapDomain mindmapDomain = new MindmapDomain();
        mindmapDomain.setName(name);
        mindmapDomain.setUserId(userId);
        return mindmapDomain;
    }
}
