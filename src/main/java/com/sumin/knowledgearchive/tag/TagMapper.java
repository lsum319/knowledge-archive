package com.sumin.knowledgearchive.tag;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TagMapper {
    //전체 태그 조회
    List<TagDomain> selectTags(@Param("name") String name);

    //개별 태그 조회
    TagDomain selectTagById(@Param("id") int id);

    //태그 생성
    int insertTag(TagDomain tagDomain);

    //태그 수정
    int updateTag(TagDomain tagDomain);

    //태그 삭제
    int deleteTag(int id);

    //materialTag 삭제
    int deleteMaterialTagByTagId(int id);
}
