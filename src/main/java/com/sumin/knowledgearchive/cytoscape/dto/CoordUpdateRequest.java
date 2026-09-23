package com.sumin.knowledgearchive.cytoscape.dto;

import lombok.Data;

@Data 
public class CoordUpdateRequest {
    private int id;
    private float coordX;
    private float coordY;
}
