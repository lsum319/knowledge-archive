package com.sumin.knowledgearchive.mindmap;

import com.sumin.knowledgearchive.mindmap.dto.CreateMindmapRequest;
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
}
