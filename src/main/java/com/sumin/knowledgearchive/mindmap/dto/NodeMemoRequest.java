package com.sumin.knowledgearchive.mindmap.dto;

import com.sumin.knowledgearchive.mindmap.MindmapMaterialDomain;
import lombok.Data;

@Data
public class NodeMemoRequest {
    private int id;
    private String memo;

    public MindmapMaterialDomain toDomain(){
        MindmapMaterialDomain domain = new MindmapMaterialDomain();
        domain.setId(this.id);
        domain.setMemo(this.memo);
        return domain;
    }
}