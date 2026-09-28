package com.sumin.knowledgearchive.cytoscape;

import com.sumin.knowledgearchive.cytoscape.dto.CoordUpdateRequest;
import com.sumin.knowledgearchive.cytoscape.dto.CytoscapeDto;
import com.sumin.knowledgearchive.material.dto.CreateMaterialRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag (name = "Cytoscape", description = "Cytoscape API")
@RestController 
@RequestMapping("/cytomap")
@RequiredArgsConstructor
public class CytoscapeController {
    private final CytoscapeService cytoscapeService;

    @Operation(summary = "마인드맵에 속한 자료 목록 조회")
    @GetMapping("/{mindmapId}")
    public ResponseEntity<CytoscapeDto.CytoscapeResponse> selectCytoscapeData(
            @PathVariable("mindmapId") int mindmapId) {
        CytoscapeDto.CytoscapeResponse response = cytoscapeService.selectCytoscapeData(mindmapId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "좌표 정보 수정")
    @PostMapping("/{mindmapId}")
    public ResponseEntity<Void> updateCoords(
            @RequestBody CoordUpdateRequest request) {
        cytoscapeService.updateCoords(request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "신규 노드 및 자료 생성")
    @PostMapping("/node/{mindmapId}")
    public ResponseEntity<Integer> createNode(
            @RequestBody CreateMaterialRequest request,
            @PathVariable("mindmapId") int mindmapId) {
        int materialId = cytoscapeService.createNodeAndMaterial(request, mindmapId);
        return ResponseEntity.ok(materialId);
    }

}
