package com.sumin.knowledgearchive.edge;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EdgeMapper {
    int insertEdge(EdgeDomain edgeDomain);
    int deleteEdge(EdgeDomain edgeDomain);
}
