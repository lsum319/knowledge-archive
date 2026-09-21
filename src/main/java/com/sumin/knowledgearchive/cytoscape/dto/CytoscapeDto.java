package com.sumin.knowledgearchive.cytoscape.dto;

import java.util.List;

public class CytoscapeDto {

    // 1. 최상위 응답 객체
    public record CytoscapeResponse(Elements elements) {
        public static CytoscapeResponse of(List<Node> nodes, List<Edge> edges) {
            return new CytoscapeResponse(new Elements(nodes, edges));
        }
    }

    // 2. elements 객체 (nodes와 edges 리스트 포함)
    public record Elements(
        List<Node> nodes,
        List<Edge> edges
    ) {}

    // 3. Node 관련 DTO
    public record Node(
        NodeData data,
        Position position
//        ,String classes // CSS 클래스 (선택)
    ) {}

    public record NodeData(
        String id,       // ★ 주의: DB에선 Long/Int 여도 반드시 String으로!
        String title
//        ,String content
    ) {}

    public record Position(
        float x,
        float y
    ) {}

    // 4. Edge 관련 DTO
    public record Edge(
        EdgeData data
    ) {}

    public record EdgeData(
        String id,
        String source,   // 출발 노드 id (String)
        String target,   // 도착 노드 id (String)
        String label     // 선 위의 글자 (선택)
    ) {}
}
