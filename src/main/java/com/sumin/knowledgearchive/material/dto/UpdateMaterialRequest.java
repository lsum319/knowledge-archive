package com.sumin.knowledgearchive.material.dto;

import com.sumin.knowledgearchive.material.MaterialDomain;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UpdateMaterialRequest {

    private String title;

    private String memo;

    private String url;

    private List<Integer> tagIds =  new ArrayList<>();

    public MaterialDomain toDomain() {

        MaterialDomain domain = new MaterialDomain();

        domain.setTitle(title);
        domain.setMemo(memo);
        domain.setUrl(url);

        return domain;
    }
}
