package com.sumin.knowledgearchive.material;

import java.util.List;

@org.apache.ibatis.annotations.Mapper
public interface MaterialMapper {
    List<MaterialDomain> selectAllMaterial();
}
