package com.sumin.knowledgearchive.material;

import com.sumin.knowledgearchive.material.dto.CreateMaterialRequest;
import com.sumin.knowledgearchive.material.dto.MaterialResponse;
import com.sumin.knowledgearchive.material.dto.UpdateMaterialRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Material", description = "자료 관리 API")
@RestController
@RequestMapping("/material")
@RequiredArgsConstructor
public class MaterialController {
    private final MaterialService materialService;

    // 제목으로 자료 검색
    @Operation(summary = "제목으로 자료 검색")
    @GetMapping(params = "title")
    public List<MaterialResponse> selectMaterials(@RequestParam(name = "title", required = false) String title){
        return materialService.selectMaterials(title);
    }

    // 태그로 자료 검색
    @Operation(summary = "태그로 자료 검색")
    @GetMapping(params = "tags")
    public List<MaterialResponse> selectMaterialsByTag(@RequestParam(name = "tags", required = false) List<String> tags) {
        return materialService.selectMaterialsByTag(tags);
    }

    // 자료 등록
    @Operation(summary = "자료 등록")
    @PostMapping
    public void insertMaterial(@RequestBody CreateMaterialRequest request){
        materialService.insertMaterial(request);
    }

    // 자료 상세 조회
    @Operation(summary = "자료 상세 조회")
    @GetMapping("/{id}")
    public MaterialResponse selectMaterialById(@PathVariable("id") int id){
        return materialService.selectMaterialById(id);
    }

    // 자료 수정
    @Operation(summary = "자료 수정")
    @PutMapping("/{id}")
    public void updateMaterialById(@PathVariable("id") int id
                                , @RequestBody UpdateMaterialRequest request){
        materialService.updateMaterial(id, request);
    }

    // 자료 삭제
    @Operation(summary = "자료 삭제")
    @DeleteMapping("/{id}")
    public void deleteMaterialById(@PathVariable("id") int id){
        materialService.deleteMaterial(id);
    }


}
