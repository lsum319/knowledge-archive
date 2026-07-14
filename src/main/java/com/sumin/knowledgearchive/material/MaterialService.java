package com.sumin.knowledgearchive.material;

import com.sumin.knowledgearchive.material.dto.CreateMaterialRequest;
import com.sumin.knowledgearchive.material.dto.MaterialResponse;
import lombok.RequiredArgsConstructor;

import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class MaterialService {
    private final MaterialMapper materialMapper;

    public List<MaterialResponse> selectAllMaterial(){
        return materialMapper.selectAllMaterial()
                .stream()
                .map(MaterialResponse::from)
                .toList();
    }

    public void createMaterial(CreateMaterialRequest request) {
        materialMapper.createMaterial(request.toDomain());
    }
}
