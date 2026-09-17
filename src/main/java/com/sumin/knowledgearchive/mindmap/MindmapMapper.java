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

    MindmapDomain selectMindmapById(
            @Param("id") int id
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
        @Param("id") int id
    );
}
