package com.sumin.knowledgearchive.material;

import com.sumin.knowledgearchive.material.dto.CreateMaterialRequest;
import com.sumin.knowledgearchive.material.dto.MaterialResponse;
import com.sumin.knowledgearchive.material.dto.UpdateMaterialRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;

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

    public MaterialResponse selectMaterialById(int id){
        MaterialDomain domain = materialMapper.selectMaterialById(id);
        return MaterialResponse.from(domain);
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
