package com.sumin.knowledgearchive.material;

import java.util.List;

@org.apache.ibatis.annotations.Mapper
public interface MaterialMapper {
    List<MaterialDomain> selectAllMaterial();

    int insertMaterial(MaterialDomain domain);

    MaterialDomain selectMaterialById(int id);

    int updateMaterial(MaterialDomain domain);

    int deleteMaterial(int id);
}
