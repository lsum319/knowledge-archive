package com.sumin.knowledgearchive.edge;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface EdgeMapper {
    List<EdgeDomain> selectEdge(int mindmapId);
    int insertEdge(EdgeDomain edgeDomain);
    int deleteEdge(EdgeDomain edgeDomain);
}
