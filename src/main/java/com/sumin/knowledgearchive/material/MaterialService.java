package com.sumin.knowledgearchive.material;

import com.sumin.knowledgearchive.material.dto.CreateMaterialRequest;
import com.sumin.knowledgearchive.material.dto.MaterialResponse;
import com.sumin.knowledgearchive.material.dto.UpdateMaterialRequest;
import com.sumin.knowledgearchive.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public void insertMaterial(CreateMaterialRequest request) {

        // 로그인 세션에서 user_id 정보 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();
        int userId = userDetails.getUserId();
        request.setUserId(userId);
        MaterialDomain materialDomain = request.toDomain();
        //insert 후 pk가 materialDomain에 세팅
        materialMapper.insertMaterial(materialDomain);

        // 자료 태그 생성
        insertMaterialTag(materialDomain.getId(), request.getTagIds());
    }

    @Transactional
    public void updateMaterial(int materialId, UpdateMaterialRequest request){
        MaterialDomain domain = request.toDomain();
        domain.setId(materialId);
        materialMapper.updateMaterial(domain);

        // 자료 태그 업데이트
        materialMapper.deleteMaterialTag(materialId);
        insertMaterialTag(materialId, request.getTagIds());

    }

    @Transactional
    public void deleteMaterial(int id){
        materialMapper.deleteMaterial(id);
        materialMapper.deleteMaterialTag(id);
    }

    // 자료 태그 생성
    public void insertMaterialTag(int materialId, List<Integer> tagIds){
        // materialDTO에서 tagId의 List객체 새로 생성하여 빈값/null검증 필요없음
        for(Integer tagId : tagIds){
            materialMapper.insertMaterialTag(materialId, tagId);
        }
    }
}
