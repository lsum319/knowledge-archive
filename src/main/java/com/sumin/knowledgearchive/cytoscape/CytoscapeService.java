package com.sumin.knowledgearchive.cytoscape;

import com.sumin.knowledgearchive.cytoscape.dto.CytoscapeDto;
import com.sumin.knowledgearchive.edge.EdgeDomain;
import com.sumin.knowledgearchive.edge.EdgeMapper;
import com.sumin.knowledgearchive.mindmap.MindmapMapper;
import com.sumin.knowledgearchive.mindmap.MindmapMaterialDomain;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CytoscapeService {
    private final MindmapMapper mindmapMapper;
    private final EdgeMapper edgeMapper;

    public CytoscapeDto.CytoscapeResponse selectCytoscapeData(int mindmapId){

        // node 세팅
        List<MindmapMaterialDomain> nodeDatas = mindmapMapper.selectNodeDataById(mindmapId);
        List<CytoscapeDto.Node> nodes = nodeDatas.stream()
                .map(data -> new CytoscapeDto.Node(
                        // 노드 데이터 세팅
                        // 개별 데이터 : pk, 제목
                        new CytoscapeDto.NodeData(
                                String.valueOf(data.getId()),
                                data.getTitle()
                        ),
                        // 노드 좌표 세팅
                        // 개별 좌표 : 출발노드 id, 도착노드 id
                        new CytoscapeDto.Position(
                                data.getCoordX(),
                                data.getCoordY()
                        )
                ))
                .toList();

        // edge 세팅
        List<EdgeDomain> edgeDates = edgeMapper.selectEdge(mindmapId);
        List<CytoscapeDto.Edge> edges = edgeDates.stream()
                .map(data -> new CytoscapeDto.Edge(
                        new CytoscapeDto.EdgeData(
                                String.valueOf(data.getId())
                                ,String.valueOf(data.getSourceId())
                                ,String.valueOf(data.getTargetId())
                                ,data.getName()
                        )
                ))
                .toList();

        return CytoscapeDto.CytoscapeResponse.of(nodes, edges);
    }
}
