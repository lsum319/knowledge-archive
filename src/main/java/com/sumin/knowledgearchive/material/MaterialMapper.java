package com.sumin.knowledgearchive.material;

import org.apache.ibatis.annotations.Param;

import java.util.List;

@org.apache.ibatis.annotations.Mapper
public interface MaterialMapper {
    List<MaterialDomain> selectMaterials(int userId, String title);

    List<MaterialDomain> selectMaterialsByTag(int userId, List<String> tags);

    int insertMaterial(MaterialDomain domain);

    MaterialDomain selectMaterialById(int userId, int id);

    int updateMaterial(MaterialDomain domain);

    int deleteMaterial(int id);

    int insertMaterialTag(
        @Param("materialId") int materialId,
        @Param("tagId") Integer tagId
    );

    int deleteMaterialTag(int materialId);
}
