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

    // 제목으로 전체 자료 조회
    public List<MaterialResponse> selectMaterials(String title){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();
        int userId = userDetails.getUserId();

        return materialMapper.selectMaterials(userId, title)
                .stream()
                .map(MaterialResponse::from)
                .toList();
    }

    // 태그로 전체 자료 조회
    public List<MaterialResponse> selectMaterialsByTag(List<String> tags){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();
        int userId = userDetails.getUserId();

        return materialMapper.selectMaterialsByTag(userId, tags)
                .stream()
                .map(MaterialResponse::from)
                .toList();
    }

    // 개별 자료 조회
    public MaterialResponse selectMaterialById(int id){
        // 로그인 세션에서 user_id 정보 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();
        int userId = userDetails.getUserId();

        MaterialDomain materialDomain = materialMapper.selectMaterialById(userId, id);
        return MaterialResponse.from(materialDomain);
    }

    // 자료 생성
    @Transactional
    public void insertMaterial(CreateMaterialRequest request) {
        MaterialDomain materialDomain = request.toDomain();

        // 로그인 세션에서 user_id 정보 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();
        int userId = userDetails.getUserId();
        materialDomain.setUserId(userId);

        //insert 후 pk가 materialDomain에 세팅
        materialMapper.insertMaterial(materialDomain);

        // 자료 태그 생성
        insertMaterialTag(materialDomain.getId(), request.getTagIds());
    }

    // 자료 수정
    @Transactional
    public void updateMaterial(int materialId, UpdateMaterialRequest request){
        MaterialDomain materialDomain = request.toDomain();

        // 수정할 자료의 pk 세팅
        materialDomain.setId(materialId);
        materialMapper.updateMaterial(materialDomain);

        // 자료 태그 업데이트
        materialMapper.deleteMaterialTag(materialId);
        insertMaterialTag(materialId, request.getTagIds());
    }

    // 자료 삭제
    @Transactional
    public void deleteMaterial(int id){
        materialMapper.deleteMaterialTag(id);
        materialMapper.deleteMaterial(id);
    }

    // 자료 태그 생성
    public void insertMaterialTag(int materialId, List<Integer> tagIds){
        // materialDTO에서 tagId의 List객체 새로 생성하여 빈값/null검증 필요없음
        for(Integer tagId : tagIds){
            materialMapper.insertMaterialTag(materialId, tagId);
        }
    }
}
