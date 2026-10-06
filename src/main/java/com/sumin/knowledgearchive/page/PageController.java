package com.sumin.knowledgearchive.page;

import com.sumin.knowledgearchive.material.MaterialService;
import com.sumin.knowledgearchive.material.dto.MaterialPageResponse;
import com.sumin.knowledgearchive.material.dto.MaterialResponse;
import com.sumin.knowledgearchive.mindmap.MindmapService;
import com.sumin.knowledgearchive.tag.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class PageController {
    private final MaterialService materialService;
    private final TagService tagService;
    private final MindmapService mindmapService;

    @GetMapping({"/login", "/login.html"})
    public String login() {
        return "login";
    }

    @GetMapping({"/signup", "/signup.html"})
    public String signup() {
        return "signup";
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
    public String materials(
            @RequestParam(name = "tag", required = false) String tag,
            @RequestParam(name = "tags", required = false) List<String> tags,
            Model model) {

        if (tags != null && !tags.isEmpty()) {
            addMaterialPage(model, materialService.selectMaterialsByTagPage(tags, 1));
        } else if (tag != null && !tag.isBlank()) {
            addMaterialPage(model, materialService.selectMaterialsByTagPage(List.of(tag), 1));
        } else {
            addMaterialPage(model, materialService.selectMaterialsPage(null, 1));
        }

        return "materials";
    }

    private void addMaterialPage(Model model, MaterialPageResponse page) {
        model.addAttribute("materials", page.materials());
        model.addAttribute("currentPage", page.currentPage());
        model.addAttribute("totalPages", page.totalPages());
        model.addAttribute("totalElements", page.totalElements());
    }

    @GetMapping({"/material-detail", "/material-detail.html"})
    public String materialDetail(@RequestParam("id") int id, Model model) {
        MaterialResponse material = materialService.selectMaterialById(id);
        model.addAttribute("material", material);
        model.addAttribute("tags", tagService.selectTags(null));
        return "material-detail";
    }

    @GetMapping({"/mindmaps", "/mindmaps.html"})
    public String mindmaps(Model model) {
        model.addAttribute("mindmaps", mindmapService.selectMindmap(null));
        return "mindmaps";
    }

    @GetMapping({"/mindmap-detail", "/mindmap-detail.html"})
    public String mindmapDetail(@RequestParam("id") int id, Model model) {
        model.addAttribute("materials", mindmapService.selectMindmapById(id));
        return "mindmap-detail";
    }

    @GetMapping({"/cytoscape", "/cytoscape.html"})
    public String cytoscape(@RequestParam("id") int id, Model model) {
        String mindmapTitle = mindmapService.selectMindmap(null).stream()
                .filter(mindmap -> mindmap.getId() == id)
                .map(mindmap -> mindmap.getName())
                .findFirst()
                .orElse("");
        model.addAttribute("mindmapId", id);
        model.addAttribute("mindmapTitle", mindmapTitle);
        return "cytoscape";
    }

}