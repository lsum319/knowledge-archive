package com.sumin.knowledgearchive.mindmap;

import com.sumin.knowledgearchive.mindmap.dto.MindmapMaterialRequest;
import com.sumin.knowledgearchive.mindmap.dto.CreateMindmapRequest;
import com.sumin.knowledgearchive.mindmap.dto.MindmapResponse;
import com.sumin.knowledgearchive.mindmap.dto.NodeMemoRequest;
import com.sumin.knowledgearchive.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MindmapService {
    private final MindmapMapper mindmapMapper;

    public List<MindmapResponse> selectMindmap(String name){
        // 로그인 세션에서 유저pk 정보 가져옴
        int userId = SecurityUtils.getCurrentUserId();

        return mindmapMapper.selectMindmap(userId, name)
                .stream()
                .map(MindmapResponse::from)
                .toList();
    }

    // 테스트용
    public List<MindmapMaterialDomain> selectMindmapById(int id){
        return mindmapMapper.selectMindmapById(id)
                .stream()
                .toList();
    }

    // 개별 노드의 툴팁 조회
    public String selectNodeMemoById(int id) {
        return mindmapMapper.selectNodeMemoById(id);
    }

    // 개별 노드의 툴팁 메모 생성
    public void insertNodeMemo(NodeMemoRequest request){
        mindmapMapper.insertNodeMemo(request.toDomain());
    }

    // 개별 노드의 툴팁 메모 수정
    public void updateNodeMemo(NodeMemoRequest request){
        mindmapMapper.updateNodeMemo(request.toDomain());
    }

    public void insertMindmap(CreateMindmapRequest request){
        int userId = SecurityUtils.getCurrentUserId();
        request.setUserId(userId);
        mindmapMapper.insertMindmap(request.toDomain());
    }

    public void deleteMindmap(int id) {
        mindmapMapper.deleteMindmap(id);
    }

    // 노드 생성 시 material 검색
    public List<MindmapMaterialDomain> selectMaterialsForNewNode(int mindmapId, String title){ 
        return mindmapMapper.selectMaterialsForNewNode(mindmapId, title)
                .stream()
                .toList();
    }
    
    // mindmap-material 작성/삭제
    public void insertMindmapMaterial(MindmapMaterialRequest request){
        mindmapMapper.insertMindmapMaterial(request.toDomain());
    }

    public void deleteMindmapMaterial(int id){
        mindmapMapper.deleteMindmapMaterial(id);
    }

}
