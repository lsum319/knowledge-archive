package com.sumin.knowledgearchive.tag;

import com.sumin.knowledgearchive.material.MaterialMapper;
import com.sumin.knowledgearchive.tag.dto.CreateTagRequest;
import com.sumin.knowledgearchive.tag.dto.TagResponse;
import com.sumin.knowledgearchive.tag.dto.UpdateTagRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagMapper tagMapper;
    private final MaterialMapper materialMapper;

    // 전체 태그 조회
    public List<TagResponse> selectTags(String name){
        return tagMapper.selectTags(name)
                .stream()
                .map(TagResponse::from)
                .toList();
    }

    // 개별 태그 조회
    public TagResponse selectTagById(int id){
        TagDomain domain = tagMapper.selectTagById(id);
        return TagResponse.from(domain);
    }

    // 태그 생성
    public int insertTag(CreateTagRequest tagRequest){
        return tagMapper.insertTag(tagRequest.toDomain());
    }

    // 태그 수정
    public int updateTag(int id, UpdateTagRequest tagRequest){
        TagDomain tagDomain = tagRequest.toDomain();
        tagDomain.setId(id);
        return tagMapper.updateTag(tagDomain);
    }

    // 태그 삭제
    @Transactional
    public int deleteTag(int id){
        // 태그를 사용중인 material에서 해당 태그 정보 삭제
        materialMapper.deleteMaterialTag(id);
        tagMapper.deleteMaterialTagByTagId(id);
        return tagMapper.deleteTag(id);
    }

}
