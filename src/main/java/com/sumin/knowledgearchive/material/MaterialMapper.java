package com.sumin.knowledgearchive.material;

import org.apache.ibatis.annotations.Param;

import java.util.List;

@org.apache.ibatis.annotations.Mapper
public interface MaterialMapper {
    int selectMaterialCount(
        @Param("userId") int userId,
        @Param("title") String title
    );

    int selectMaterialCountByTag(
        @Param("userId") int userId,
        @Param("tags") List<String> tags
    );

    List<MaterialDomain> selectMaterials(
        @Param("userId") int userId,
        @Param("title") String title,
        @Param("limit") int limit,
        @Param("offset") int offset
    );

    List<MaterialDomain> selectMaterialsByTag(
        @Param("userId") int userId,
        @Param("tags") List<String> tags,
        @Param("limit") int limit,
        @Param("offset") int offset
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
