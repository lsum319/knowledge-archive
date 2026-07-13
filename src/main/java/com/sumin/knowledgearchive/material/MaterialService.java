package com.sumin.knowledgearchive.material;

import lombok.RequiredArgsConstructor;

import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class MaterialService {
    private final MaterialMapper materialMapper;

    public List<MaterialDomain> selectAllMaterial(){
        return materialMapper.selectAllMaterial();
    }
}
