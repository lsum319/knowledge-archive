package com.sumin.knowledgearchive.mindmap;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MindmapMapper {
    List<MindmapDomain> selectMindmap(
        @Param("userId") int userId,
        @Param("name") String name
    );

    // 테스트용 마인드맵 내 자료목록 조회용
    List<MindmapMaterialDomain> selectMindmapById(
            @Param("mindmapId") int mindmapId
    );

    // 노드 생성 시 material 검색
    List<MindmapMaterialDomain> selectMaterialsForNewNode(
            @Param("mindmapId") int mindmapId
            ,@Param("title") String title
    );

    // 개별 노드의 툴팁 조회
    String selectNodeMemoById(@Param("id") int id);

    // 개별 노드의 툴팁 메모 작성
    int insertNodeMemo(MindmapMaterialDomain mindmapMaterialDomain);

    // 개별 노드의 툴팁 메모 수정
    int updateNodeMemo(MindmapMaterialDomain mindmapMaterialDomain);

    // cytoscape를 위한 nodeData(material data, 좌표) 조회
    List<MindmapMaterialDomain> selectNodeDataById(
            @Param("mindmapId") int mindmapId
    );

    int insertMindmap(
        MindmapDomain mindmapDomain
    );

    int deleteMindmap(
        @Param("id") int id
    );

    int insertMindmapMaterial(MindmapMaterialDomain mindmapMaterialDomain);

    int deleteMindmapMaterial(
            @Param("id") int id
    );
    
    // 좌표 정보 수정
    int updateCoords(MindmapMaterialDomain mindmapMaterialDomain);
}
