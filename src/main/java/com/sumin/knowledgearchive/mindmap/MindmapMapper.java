package com.sumin.knowledgearchive.mindmap;

import com.sumin.knowledgearchive.material.MaterialDomain;
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

    int insertMindmapMaterial(
        @Param("mindmapId") int mindmapId,
        @Param("materialId") int materialId
    );

    int deleteMindmapMaterial(
        @Param("mindmapId") int mindmapId,
        @Param("materialId") int materialId
    );
}
