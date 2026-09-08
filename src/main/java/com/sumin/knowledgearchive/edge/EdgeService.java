package com.sumin.knowledgearchive.edge;

import com.sumin.knowledgearchive.edge.dto.EdgeRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EdgeService {
    private final EdgeMapper edgeMapper;

    public void insertEdge(EdgeRequest edgeRequest) {
        edgeMapper.insertEdge(edgeRequest.toDomain());
    }

    public void deleteEdge(EdgeRequest edgeRequest) {
        edgeMapper.deleteEdge(edgeRequest.toDomain());
    }
}
