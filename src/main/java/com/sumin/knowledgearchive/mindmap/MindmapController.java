package com.sumin.knowledgearchive.mindmap;

import com.sumin.knowledgearchive.mindmap.dto.MindmapMaterialRequest;
import com.sumin.knowledgearchive.mindmap.dto.CreateMindmapRequest;
import com.sumin.knowledgearchive.mindmap.dto.MindmapResponse;
import com.sumin.knowledgearchive.mindmap.dto.NodeMemoRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Mindmap", description = "마인드맵 API")
@RestController
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
    public List<MindmapMaterialDomain> selectMindmapById(@PathVariable("id") int id) {
        return mindmapService.selectMindmapById(id);
    }
    
    // 툴팁 조회
    @Operation(summary = "마인드맵의 특정 노드의 memo조회")
    @GetMapping("/node/{id}/memo")
    public String selectNodeMemoById(@PathVariable("id") int id){
        return mindmapService.selectNodeMemoById(id);
    }

    // 툴팁 수정
    @Operation(summary = "마인드맵의 특정 노드의 memo 수정")
    @PutMapping("/node/{id}/memo")
    public void updateNodeMemo(@PathVariable("id") int id, @RequestBody NodeMemoRequest request) {
        request.setId(id);
        mindmapService.updateNodeMemo(request);
    }

    // 노드 스타일 수정
    @Operation(summary = "노드 스타일 수정")
    @PutMapping("/node/{id}/style")
    public void updateNodeStyle(@PathVariable("id") int id, @RequestBody MindmapMaterialRequest request) {
        request.setId(id);
        mindmapService.updateNodeStyle(request);
    }
    
    // 노드 생성 시 기존에 작성된 material 검색
    @Operation(summary = "노드 생성 시 기존에 작성된 material 검색")
    @GetMapping("/material/{mindmapId}")
    public List<MindmapMaterialDomain> selectMaterialsForNewNode(
            @PathVariable("mindmapId") int mindmapId,
            @RequestParam("title") String title){
        return mindmapService.selectMaterialsForNewNode(mindmapId, title);
    }

    // 마인드맵에 노드 추가
    @Operation(summary = "마인드맵에 노드 추가")
    @PostMapping("/{mindmapId}")
    public void insertMindmapMaterial(
            @PathVariable("mindmapId") int mindmapId,
            @RequestBody MindmapMaterialRequest request){
        request.setMindmapId(mindmapId);
        mindmapService.insertMindmapMaterial(request);
    }

    // 마인드맵에 속한 노드 삭제
    @Operation(summary = "마인드맵의 노드 삭제")
    @DeleteMapping("/material/{id}")
    public void deleteMindmapMaterial(@PathVariable("id") int id){
        mindmapService.deleteMindmapMaterial(id);
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
