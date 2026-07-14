package com.sumin.knowledgearchive.material;

import com.sumin.knowledgearchive.material.dto.CreateMaterialRequest;
import com.sumin.knowledgearchive.material.dto.MaterialResponse;
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
    public void insertMaterial(@RequestBody CreateMaterialRequest createMaterialRequest){
        materialService.createMaterial(createMaterialRequest);
    }
}
