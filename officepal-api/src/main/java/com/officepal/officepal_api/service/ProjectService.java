package com.officepal.officepal_api.service;

import com.officepal.officepal_api.repository.ProjectRepository;
import com.officepal.officepal_api.repository.UserRepository;
import com.officepal.officepal_api.entity.Project;
import com.officepal.officepal_api.entity.User;
import com.officepal.officepal_api.dto.ProjectCreateRequest;
import com.officepal.officepal_api.dto.ProjectUpdateRequest;
import com.officepal.officepal_api.dto.ProjectResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;
    public Project createProject(ProjectCreateRequest request, User owner) {
        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setOwner(owner);
        java.util.List<User> members = new java.util.ArrayList<>();
        if (request.getMembers() != null && !request.getMembers().isEmpty()) {
            members.addAll(userRepository.findAllById(request.getMembers()));
        }
        // Ensure owner is always a member
        if (members.stream().noneMatch(u -> u.getId().equals(owner.getId()))) {
            members.add(owner);
        }
        project.setMembers(members);
        return projectRepository.save(project);
    }
    public ProjectResponse toProjectResponse(Project project) {
        ProjectResponse dto = new ProjectResponse();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setOwnerUsername(project.getOwner() != null ? project.getOwner().getUsername() : null);
        if (project.getMembers() != null) {
            java.util.List<ProjectResponse.MemberDto> memberDtos = project.getMembers().stream()
                .map(u -> new ProjectResponse.MemberDto(u.getId(), u.getUsername(), u.getEmail()))
                .toList();
            dto.setMembers(memberDtos);
        }
        return dto;
    }
    public List<ProjectResponse> getProjectsByOwner(User owner) {
        return projectRepository.findByOwnerId(owner.getId())
            .stream().map(this::toProjectResponse).toList();
    }
    public Optional<ProjectResponse> getProjectByIdAndOwner(Long id, User user) {
        return projectRepository.findById(id)
                .filter(project -> project.getOwner().getId().equals(user.getId()) ||
                        (project.getMembers() != null && project.getMembers().stream().anyMatch(m -> m.getId().equals(user.getId()))))
                .map(this::toProjectResponse);
    }
    // In ProjectService, add a helper method to check owner
    private void checkOwner(Project project, User user) {
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("Bu işlem için yetkiniz yok. Sadece proje sahibi bu işlemi yapabilir.");
        }
    }
    public Project updateProject(Long id, ProjectUpdateRequest request, User user) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proje bulunamadı."));
        checkOwner(project, user);
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        if (request.getMembers() != null) {
            var members = userRepository.findAllById(request.getMembers());
            project.setMembers(members);
        }
        return projectRepository.save(project);
    }
    public void deleteProject(Long id, User user) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proje bulunamadı."));
        checkOwner(project, user);
        projectRepository.delete(project);
    }
    public List<ProjectResponse> getProjectsByMember(User member) {
        return projectRepository.findByMembers_Id(member.getId())
            .stream().map(this::toProjectResponse).toList();
    }
}