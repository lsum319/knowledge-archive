package com.sumin.knowledgearchive.edge;

import com.sumin.knowledgearchive.edge.dto.EdgeRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EdgeService {
    private final EdgeMapper edgeMapper;

    public int insertEdge(EdgeRequest edgeRequest) {
        EdgeDomain edgeDomain = edgeRequest.toDomain();
        edgeMapper.insertEdge(edgeDomain);
        return edgeDomain.getId();
    }

    public void deleteEdge(int id) {
        edgeMapper.deleteEdge(id);
    }

    public void updateEdge(EdgeRequest edgeRequest) {
        edgeMapper.updateEdge(edgeRequest.toDomain());
    }
}
