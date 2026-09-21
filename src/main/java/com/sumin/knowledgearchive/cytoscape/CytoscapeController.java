package com.sumin.knowledgearchive.cytoscape;

import com.sumin.knowledgearchive.cytoscape.dto.CytoscapeDto;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cytomap")
@RequiredArgsConstructor
public class CytoscapeController {
    private final CytoscapeService cytoscapeService;

    @Operation
    @GetMapping("/{mindmapId}")
    // 마인드맵에 속한 자료 목록 조회
    public ResponseEntity<CytoscapeDto.CytoscapeResponse> selectCytoscapeData(@PathVariable("mindmapId") int mindmapId){
        CytoscapeDto.CytoscapeResponse response = cytoscapeService.selectCytoscapeData(mindmapId);
        return ResponseEntity.ok(response);
    }

}
