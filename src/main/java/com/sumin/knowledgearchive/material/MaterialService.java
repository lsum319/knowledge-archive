package com.sumin.knowledgearchive.material;

import com.sumin.knowledgearchive.material.dto.CreateMaterialRequest;
import com.sumin.knowledgearchive.material.dto.MaterialPageResponse;
import com.sumin.knowledgearchive.material.dto.MaterialResponse;
import com.sumin.knowledgearchive.material.dto.UpdateMaterialRequest;
import com.sumin.knowledgearchive.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class MaterialService {
    private static final int PAGE_SIZE = 20;

    private final MaterialMapper materialMapper;

    // 전체 자료 수 조회
    public int selectMaterialCount(String title){
        // 로그인 세션에서 유저pk 정보 가져옴
        int userId = SecurityUtils.getCurrentUserId();
        return materialMapper.selectMaterialCount(userId, title);
    }

    public MaterialPageResponse selectMaterialsPage(String title, int requestedPage) {
        int userId = SecurityUtils.getCurrentUserId();
        int totalElements = materialMapper.selectMaterialCount(userId, title);
        int totalPages = getTotalPages(totalElements);
        int currentPage = normalizePage(requestedPage, totalPages);
        List<MaterialResponse> materials = materialMapper.selectMaterials(
                        userId, title, PAGE_SIZE, getOffset(currentPage))
                .stream()
                .map(MaterialResponse::from)
                .toList();
        return new MaterialPageResponse(materials, currentPage, totalPages, totalElements);
    }

    public MaterialPageResponse selectMaterialsByTagPage(List<String> tags, int requestedPage) {
        int userId = SecurityUtils.getCurrentUserId();
        int totalElements = materialMapper.selectMaterialCountByTag(userId, tags);
        int totalPages = getTotalPages(totalElements);
        int currentPage = normalizePage(requestedPage, totalPages);
        List<MaterialResponse> materials = materialMapper.selectMaterialsByTag(
                        userId, tags, PAGE_SIZE, getOffset(currentPage))
                .stream()
                .map(MaterialResponse::from)
                .toList();
        return new MaterialPageResponse(materials, currentPage, totalPages, totalElements);
    }

    // 제목으로 자료 조회 (기존 호출부 호환)
    public List<MaterialResponse> selectMaterials(String title){
        return selectMaterialsPage(title, 1).materials();
    }

    // 태그로 자료 조회 (기존 호출부 호환)
    public List<MaterialResponse> selectMaterialsByTag(List<String> tags){
        return selectMaterialsByTagPage(tags, 1).materials();
    }

    private int getTotalPages(int totalElements) {
        return (int) ((totalElements + (long) PAGE_SIZE - 1) / PAGE_SIZE);
    }

    private int normalizePage(int requestedPage, int totalPages) {
        return Math.min(Math.max(requestedPage, 1), Math.max(totalPages, 1));
    }

    private int getOffset(int currentPage) {
        return (currentPage - 1) * PAGE_SIZE;
    }

    // 개별 자료 조회
    public MaterialResponse selectMaterialById(int id){
        // 로그인 세션에서 유저pk 정보 가져옴
        int userId = SecurityUtils.getCurrentUserId();
        MaterialDomain materialDomain = materialMapper.selectMaterialById(userId, id);
        return MaterialResponse.from(materialDomain);
    }

    // 자료 생성
    // 다른 api에서 materialService.insertMaterial() 호출하여 사용
    @Transactional
    public int insertMaterial(CreateMaterialRequest request) {
        int userId = SecurityUtils.getCurrentUserId();
        request.setUserId(userId);
        MaterialDomain materialDomain = request.toDomain();

        //insert 후 pk가 materialDomain에 세팅
        materialMapper.insertMaterial(materialDomain);

        // 자료 태그 생성
        insertMaterialTag(materialDomain.getId(), request.getTagIds());

        return materialDomain.getId();
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
