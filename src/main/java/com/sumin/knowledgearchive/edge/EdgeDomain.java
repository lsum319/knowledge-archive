package com.sumin.knowledgearchive.edge;

import lombok.Data;

@Data
public class EdgeDomain {
    private int id;
    private int mindmapId;
    private int sourceId;
    private int targetId;
    private String name;
    private String createdAt;
    private String updatedAt;
}
