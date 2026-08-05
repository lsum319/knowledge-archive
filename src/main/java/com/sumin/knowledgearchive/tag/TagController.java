package com.sumin.knowledgearchive.tag;

import com.sumin.knowledgearchive.tag.dto.CreateTagRequest;
import com.sumin.knowledgearchive.tag.dto.TagResponse;
import com.sumin.knowledgearchive.tag.dto.UpdateTagRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name="Tag", description = "태그 관리 API")
@RestController
@RequestMapping("/tag")
@RequiredArgsConstructor
public class TagController {
    private final TagService tagService;

    // 태그 검색
    @Operation(summary = "태그 검색")
    @GetMapping
    public List<TagResponse> selectTags(@RequestParam(required = false) String name){
        return tagService.selectTags(name);
    }

    // 개별 태그 검색
    @Operation(summary = "개별 태그 검색")
    @GetMapping("/{id}")
    public TagResponse selectTagById(@PathVariable int id){
        return tagService.selectTagById(id);
    }

    // 태그 생성
    @Operation(summary = "태그 생성")
    @PostMapping
    public void insertTag(@RequestBody CreateTagRequest tagRequest){
        tagService.insertTag(tagRequest);
    }

    // 태그 수정
    @Operation(summary = "태그 수정")
    @PutMapping("/{id}")
    public void updateTag(@PathVariable("id") int id
                         ,@RequestBody UpdateTagRequest tagRequest){
        tagService.updateTag(id, tagRequest);
    }

    //태그 삭제
    @Operation(summary = "태그 삭제")
    @DeleteMapping("/{id}")
    public void deleteTag(@PathVariable("id")int id){
        tagService.deleteTag(id);
    }
}
