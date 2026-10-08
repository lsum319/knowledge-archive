package com.sumin.knowledgearchive.edge;

import com.sumin.knowledgearchive.edge.dto.EdgeRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Edge", description = "자료 관계 관리 API")
@RestController
@RequestMapping("/edge")
@RequiredArgsConstructor
public class EdgeController {
    private final EdgeService edgeService;

    @Operation(summary = "자료 관계 등록")
    @PostMapping
    public int insertEdge(@RequestBody EdgeRequest request) {
        return edgeService.insertEdge(request);
    }

    @Operation(summary = "자료 관계 삭제")
    @DeleteMapping("/{id}")
    public void deleteEdge(@PathVariable int id) {
        edgeService.deleteEdge(id);
    }

    @Operation(summary = "자료 관계 이름 수정")
    @PutMapping("/name")
    public void updateEdgeName(@RequestBody EdgeRequest request) {
        edgeService.updateEdgeName(request);
    }

    @Operation(summary = "자료 관계 스타일 수정")
    @PutMapping("/style")
    public void updateEdgeStyle(@RequestBody EdgeRequest request) {
        edgeService.updateEdgeStyle(request);
    }
}