package com.officepal.officepal_api.controller;

import com.officepal.officepal_api.service.ProjectService;
import com.officepal.officepal_api.entity.Project;
import com.officepal.officepal_api.entity.User;
import com.officepal.officepal_api.dto.ProjectCreateRequest;
import com.officepal.officepal_api.dto.ProjectUpdateRequest;
import com.officepal.officepal_api.dto.ProjectResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/projects")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @PostMapping
    public ProjectResponse createProject(@RequestBody ProjectCreateRequest request, @AuthenticationPrincipal User user) {
        Project created = projectService.createProject(request, user);
        return projectService.toProjectResponse(created);
    }

    @GetMapping
    public List<ProjectResponse> getMyProjects(@AuthenticationPrincipal User user) {
        return projectService.getProjectsByOwner(user);
    }

    @GetMapping("/member")
    public List<ProjectResponse> getProjectsByMember(@AuthenticationPrincipal User user) {
        return projectService.getProjectsByMember(user);
    }

    @GetMapping("/{id}")
    public Optional<ProjectResponse> getProjectById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return projectService.getProjectByIdAndOwner(id, user);
    }

    @PutMapping("/{id}")
    public ProjectResponse updateProject(@PathVariable Long id, @RequestBody ProjectUpdateRequest request, @AuthenticationPrincipal User user) {
        Project updated = projectService.updateProject(id, request, user);
        return projectService.toProjectResponse(updated);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id, @AuthenticationPrincipal User user) {
        projectService.deleteProject(id, user);
    }
}