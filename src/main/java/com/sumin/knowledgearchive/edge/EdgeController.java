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

    @Operation(summary = "자료 하위 관계 등록")
    @PostMapping
    public void insertEdge(@RequestBody EdgeRequest request) {
        edgeService.insertEdge(request);
    }

    @Operation(summary = "자료 하위 관계 삭제")
    @DeleteMapping
    public void deleteEdge(@RequestBody EdgeRequest request) {
        edgeService.deleteEdge(request);
    }
}