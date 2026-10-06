package com.sumin.knowledgearchive.material.dto;

import java.util.List;

public record MaterialPageResponse(
        List<MaterialResponse> materials,
        int currentPage,
        int totalPages,
        int totalElements
) {
}
