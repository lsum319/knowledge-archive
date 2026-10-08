package com.sumin.knowledgearchive.mindmap.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.sumin.knowledgearchive.mindmap.MindmapMaterialDomain;
import lombok.Data;

@Data
public class MindmapMaterialRequest {
    private int id;
    private int mindmapId;
    private int materialId;
    private float coordX;
    private float coordY;
    private JsonNode style;

    public MindmapMaterialDomain toDomain(){
        MindmapMaterialDomain domain = new MindmapMaterialDomain();
        domain.setId(id);
        domain.setMindmapId(mindmapId);
        domain.setMaterialId(materialId);
        domain.setCoordX(coordX);
        domain.setCoordY(coordY);
        domain.setStyle(style);
        return domain;
    }
}
