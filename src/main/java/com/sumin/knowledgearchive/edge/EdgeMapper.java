package com.sumin.knowledgearchive.edge;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EdgeMapper {
    List<EdgeDomain> selectEdge(int mindmapId);
    int insertEdge(EdgeDomain edgeDomain);
    int deleteEdge(@Param("id") int id);
    int updateEdgeName(EdgeDomain edgeDomain);
    int updateEdgeStyle(EdgeDomain edgeDomain);
}
