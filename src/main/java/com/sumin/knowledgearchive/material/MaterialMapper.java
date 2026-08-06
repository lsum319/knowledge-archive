package com.sumin.knowledgearchive.material;

import org.apache.ibatis.annotations.Param;

import java.util.List;

@org.apache.ibatis.annotations.Mapper
public interface MaterialMapper {
    List<MaterialDomain> selectMaterials(String title);

    int insertMaterial(MaterialDomain domain);

    MaterialDomain selectMaterialById(int id);

    int updateMaterial(MaterialDomain domain);

    int deleteMaterial(int id);

    int insertMaterialTag(
        @Param("materialId") int materialId,
        @Param("tagId") Integer tagId
    );

    int deleteMaterialTag(int materialId);
}
