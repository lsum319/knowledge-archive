package com.sumin.knowledgearchive.edge.dto;

import com.sumin.knowledgearchive.edge.EdgeDomain;
import lombok.Data;

@Data
public class EdgeRequest {
    private int id;
    private int mindmapId;
    private int sourceId;
    private int targetId;
    private String name;

    public EdgeDomain toDomain() {
        EdgeDomain edgeDomain = new EdgeDomain();
        edgeDomain.setId(id);
        edgeDomain.setMindmapId(mindmapId);
        edgeDomain.setSourceId(sourceId);
        edgeDomain.setTargetId(targetId);
        edgeDomain.setName(name);
        return edgeDomain;
    }
}
