package com.sumin.knowledgearchive.material.dto;

import com.sumin.knowledgearchive.material.MaterialDomain;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class CreateMaterialRequest {

    private String title;

    private String memo;

    private String url;

    private int userId; // 차후 security에서 가져올것

    private List<Integer> tagIds = new ArrayList<>();

    public MaterialDomain toDomain() {

        MaterialDomain domain = new MaterialDomain();

        domain.setTitle(title);
        domain.setMemo(memo);
        domain.setUrl(url);
        domain.setUserId(userId);

        return domain;
    }
}