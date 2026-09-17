package com.sumin.knowledgearchive.mindmap;

import com.sumin.knowledgearchive.material.dto.MaterialResponse;
import com.sumin.knowledgearchive.mindmap.dto.CreateMindmapRequest;
import com.sumin.knowledgearchive.mindmap.dto.MindmapResponse;
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

    public List<MaterialResponse> selectMindmapById(int id){
        return mindmapMapper.selectMindmapById(id)
                .stream()
                .map(MaterialResponse::from)
                .toList();
    }

    public void insertMindmap(CreateMindmapRequest request){
        int userId = SecurityUtils.getCurrentUserId();
        request.setUserId(userId);
        mindmapMapper.insertMindmap(request.toDomain());
    }

    public void deleteMindmap(int id){
        mindmapMapper.deleteMindmap(id);
    }

    // mindmap-material 작성/삭제
    public void insertMindmapMaterial(int mindmapId, int materialId){
        mindmapMapper.insertMindmapMaterial(mindmapId, materialId);
    }

    public void deleteMindmapMaterial(int id){
        mindmapMapper.deleteMindmapMaterial(id);
    }
}
