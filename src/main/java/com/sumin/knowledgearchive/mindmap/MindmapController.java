package com.sumin.knowledgearchive.mindmap;

import com.sumin.knowledgearchive.material.dto.MaterialResponse;
import com.sumin.knowledgearchive.mindmap.dto.CreateMindmapRequest;
import com.sumin.knowledgearchive.mindmap.dto.MindmapResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("/mindmap")
@RequestMapping("/mindmap")
@RequiredArgsConstructor
public class MindmapController {
    private final MindmapService mindmapService;

    // 이름으로 마인드맵 목록 검색
    @Operation(summary = "마인드맵 목록 조회")
    @GetMapping
    public List<MindmapResponse> selectMindmap(@RequestParam(name = "name", required = false) String name){
        return mindmapService.selectMindmap(name);
    }

    // (테스트용) 마인드맵에 속한 자료 목록 조회
    @Operation(summary = "마인드맵의 자료 목록 조회")
    @GetMapping("/{id}")
    public List<MindmapMaterialDomain> selectMindmapById(@PathVariable("id") int id){
        return mindmapService.selectMindmapById(id);
    }

    // 마인드맵에 자료 추가
    @Operation(summary = "마인드맵에 자료 추가")
    @PostMapping("/{id}/{materialId}")
    public void insertMindmapMaterial(@PathVariable("id") int mindmapId,
                                      @PathVariable("materialId") int materialId){
        mindmapService.insertMindmapMaterial(mindmapId, materialId);
    }

    // 마인드맵에 속한 자료 삭제
    @Operation(summary = "마인드맵의 자료 삭제")
    @DeleteMapping("/{mindmapId}/{materialId}")
    public void deleteMindmapMaterial(@PathVariable("mindmapId") int mindmapId,
                                      @PathVariable("materialId") int materialId){
        mindmapService.deleteMindmapMaterial(mindmapId, materialId);
    }

    // 마인드맵 생성
    @Operation(summary = "마인드맵 생성")
    @PostMapping
    public void insertMaterial(@RequestBody CreateMindmapRequest request){
        mindmapService.insertMindmap(request);
    }

    // 마인드맵 삭제
    @Operation(summary = "마인드맵 삭제")
    @DeleteMapping("/{id}")
    public void deleteMaterial(@PathVariable("id") int id){
        mindmapService.deleteMindmap(id);
    }

}
