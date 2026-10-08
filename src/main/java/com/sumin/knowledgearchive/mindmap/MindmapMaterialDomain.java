package com.sumin.knowledgearchive.mindmap;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

@Data
public class MindmapMaterialDomain {
    private int id;
    private int mindmapId;
    private int materialId;
    private String memo;
    private JsonNode style; // json 형태의 스타일 데이터

    // 필요에 의해 추가된 material의 필드
    private String title;

    private float coordX;
    private float coordY;
    private String createdAt;
    private String updatedAt;
}
