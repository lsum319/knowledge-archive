package com.sumin.knowledgearchive.mindmap;

import lombok.Data;

@Data
public class MindmapMaterialDomain {
    private int id;
    private int mindmapId;
    private int materialId;

    // 필요에 의해 추가된 material의 필드
    private String title;

    private float coordX;
    private float coordY;
    private String createdAt;
    private String updatedAt;
}
