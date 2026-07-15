package com.sumin.knowledgearchive.material;

import com.sumin.knowledgearchive.material.dto.CreateMaterialRequest;
import com.sumin.knowledgearchive.material.dto.MaterialResponse;
import com.sumin.knowledgearchive.material.dto.UpdateMaterialRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/material")
@RequiredArgsConstructor
public class MaterialController {
    private final MaterialService materialService;

    @GetMapping
    public List<MaterialResponse> selectAllMaterial(){
        return materialService.selectAllMaterial();
    }

    // 글작성
    @PostMapping
    public void insertMaterial(@RequestBody CreateMaterialRequest request){
        materialService.createMaterial(request);
    }

    // 글 상세 조회
    @GetMapping("/{id}")
    public MaterialResponse selectMaterialById(@PathVariable("id") int id){
        return materialService.selectMaterialById(id);
    }

    // 글 수정
    @PutMapping("/{id}")
    public void updateMaterialById(@PathVariable("id") int id
                                            , @RequestBody UpdateMaterialRequest request){
        materialService.updateMaterial(id, request);
    }

    // 글 삭제
    @DeleteMapping("/{id}")
    public void deleteMaterialById(@PathVariable("id") int id){
        materialService.deleteMaterial(id);
    }
}
