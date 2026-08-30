package com.sumin.knowledgearchive.material;

import org.apache.ibatis.annotations.Param;

import java.util.List;

@org.apache.ibatis.annotations.Mapper
public interface MaterialMapper {
    List<MaterialDomain> selectMaterials(
        @Param("userId") int userId,
        @Param("title") String title
    );

    List<MaterialDomain> selectMaterialsByTag(
        @Param("userId") int userId,
        @Param("tags") List<String> tags
    );

    int insertMaterial(MaterialDomain domain);

    MaterialDomain selectMaterialById(
        @Param("userId") int userId,
        @Param("id") int id
    );

    int updateMaterial(MaterialDomain domain);

    int deleteMaterial(int id);

    int insertMaterialTag(
        @Param("materialId") int materialId,
        @Param("tagId") Integer tagId
    );

    int deleteMaterialTag(int materialId);
}
