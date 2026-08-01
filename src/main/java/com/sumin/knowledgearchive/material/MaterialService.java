package com.sumin.knowledgearchive.material;

import com.sumin.knowledgearchive.material.dto.CreateMaterialRequest;
import com.sumin.knowledgearchive.material.dto.MaterialResponse;
import com.sumin.knowledgearchive.material.dto.UpdateMaterialRequest;
import lombok.RequiredArgsConstructor;

import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class MaterialService {
    private final MaterialMapper materialMapper;

    public List<MaterialResponse> selectMaterials(String title){
        return materialMapper.selectMaterials(title)
                .stream()
                .map(MaterialResponse::from)
                .toList();
    }

    public MaterialResponse selectMaterialById(int id){
        MaterialDomain domain = materialMapper.selectMaterialById(id);
        return MaterialResponse.from(domain);
    }

    public void insertMaterial(CreateMaterialRequest request) {
        materialMapper.insertMaterial(request.toDomain());
    }

    public void updateMaterial(int id, UpdateMaterialRequest request){
        MaterialDomain domain = request.toDomain();
        domain.setId(id);
        materialMapper.updateMaterial(domain);
    }

    public void deleteMaterial(int id){
        materialMapper.deleteMaterial(id);
    }
}
