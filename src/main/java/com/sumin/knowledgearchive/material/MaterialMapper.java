package com.sumin.knowledgearchive.material;

import com.sumin.knowledgearchive.material.dto.CreateMaterialRequest;

import java.util.List;

@org.apache.ibatis.annotations.Mapper
public interface MaterialMapper {
    List<MaterialDomain> selectAllMaterial();

    int createMaterial(MaterialDomain domain);
}
