package com.sumin.knowledgearchive.cytoscape;

import com.sumin.knowledgearchive.cytoscape.dto.CoordUpdateRequest;
import com.sumin.knowledgearchive.cytoscape.dto.CytoscapeDto;
import com.sumin.knowledgearchive.edge.EdgeDomain;
import com.sumin.knowledgearchive.edge.EdgeMapper;
import com.sumin.knowledgearchive.material.MaterialService;
import com.sumin.knowledgearchive.material.dto.CreateMaterialRequest;
import com.sumin.knowledgearchive.mindmap.MindmapMapper;
import com.sumin.knowledgearchive.mindmap.MindmapMaterialDomain;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CytoscapeService {
    private final MindmapMapper mindmapMapper;
    private final EdgeMapper edgeMapper;
    private final MaterialService materialService;

    public CytoscapeDto.CytoscapeResponse selectCytoscapeData(int mindmapId) {
            // node 세팅
            List<MindmapMaterialDomain> nodeDatas = mindmapMapper.selectNodeDataById(mindmapId);
            List<CytoscapeDto.Node> nodes = nodeDatas.stream()
                            .map(data -> new CytoscapeDto.Node(
                                            // 노드 데이터 세팅
                                            // 개별 데이터 : mindmapMaterialId(pk), 제목
                                            new CytoscapeDto.NodeData(
                                                            String.valueOf(data.getId()),
                                                            String.valueOf(data.getMaterialId()),
                                                            data.getTitle()),
                                            // 노드 좌표 세팅
                                            // 개별 좌표 : 출발노드 id, 도착노드 id
                                            new CytoscapeDto.Position(
                                                            data.getCoordX(),
                                                            data.getCoordY())))
                            .toList();

            // edge 세팅
            List<EdgeDomain> edgeDates = edgeMapper.selectEdge(mindmapId);
            List<CytoscapeDto.Edge> edges = edgeDates.stream()
                            .map(data -> new CytoscapeDto.Edge(
                                            new CytoscapeDto.EdgeData(
                                                            String.valueOf(data.getId()),
                                                            String.valueOf(data.getSourceId()),
                                                            String.valueOf(data.getTargetId()),
                                                            data.getName())))
                            .toList();

            return CytoscapeDto.CytoscapeResponse.of(nodes, edges);
    }
    
    // 좌표 정보 수정
    public void updateCoords(CoordUpdateRequest request) {
        MindmapMaterialDomain domain = new MindmapMaterialDomain();
        domain.setId(request.getId());
        domain.setCoordX(request.getCoordX());
        domain.setCoordY(request.getCoordY());
        mindmapMapper.updateCoords(domain);
    }

    // 신규 노드(Material) 생성
    @Transactional 
    public int createNodeAndMaterial(CreateMaterialRequest request, int mindmapId) {
        // 1. Material 생성
        int materialId = materialService.insertMaterial(request);

        // 2. MindmapMaterial 생성
        MindmapMaterialDomain domain = new MindmapMaterialDomain();
        domain.setMindmapId(mindmapId);
        domain.setMaterialId(materialId);
        mindmapMapper.insertMindmapMaterial(domain);

        return materialId;
    }

}
