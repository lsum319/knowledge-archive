package com.sumin.knowledgearchive.edge;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

@Data
public class EdgeDomain {
    private int id;
    private int mindmapId;
    private int sourceId;
    private int targetId;
    private String name;
    private JsonNode style; // json 형태의 스타일 데이터
    private String createdAt;
    private String updatedAt;
}
