package com.sumin.knowledgearchive.config;

import com.sumin.knowledgearchive.material.MaterialService;
import com.sumin.knowledgearchive.material.dto.MaterialResponse;
import com.sumin.knowledgearchive.tag.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
public class PageController {
    private final MaterialService materialService;
    private final TagService tagService;

    @GetMapping({"/login", "/login.html"})
    public String login() {
        return "login";
    }

    @GetMapping({"/material-create", "/material-create.html"})
    public String materialCreate() {
        return "material-create";
    }

    @GetMapping({"/material-edit", "/material-edit.html"})
    public String materialEdit() {
        return "material-edit";
    }

    @GetMapping({"/tags", "/tags.html"})
    public String tags() {
        return "tags";
    }

    @GetMapping({"/materials", "/materials.html"})
    public String materials(Model model) {
        model.addAttribute("materials", materialService.selectMaterials(null));
        return "materials";
    }

    @GetMapping({"/material-detail", "/material-detail.html"})
    public String materialDetail(@RequestParam int id, Model model) {
        MaterialResponse material = materialService.selectMaterialById(id);
        model.addAttribute("material", material);
        model.addAttribute("tags", tagService.selectTags(null));
        return "material-detail";
    }
}