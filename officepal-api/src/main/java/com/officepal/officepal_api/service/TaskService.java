package com.officepal.officepal_api.service;

import com.officepal.officepal_api.repository.TaskRepository;
import com.officepal.officepal_api.repository.ProjectRepository;
import com.officepal.officepal_api.repository.UserRepository;
import com.officepal.officepal_api.entity.Task;
import com.officepal.officepal_api.entity.Project;
import com.officepal.officepal_api.entity.User;
import com.officepal.officepal_api.entity.TaskStatus;
import com.officepal.officepal_api.dto.TaskCreateRequest;
import com.officepal.officepal_api.dto.TaskUpdateRequest;
import com.officepal.officepal_api.dto.TaskResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;
    public TaskResponse createTask(TaskCreateRequest request, User user) {
        Project project = projectRepository.findById(request.getProjectId())
            .orElseThrow(() -> new RuntimeException("Project not found"));
        // Only project owner can create tasks
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("Sadece proje sahibi görev oluşturabilir.");
        }
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(TaskStatus.valueOf(request.getStatus()));
        task.setProject(project);
        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                .orElseThrow(() -> new RuntimeException("Assignee not found"));
            task.setAssignee(assignee);
        }
        return toTaskResponse(taskRepository.save(task));
    }
    public List<TaskResponse> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId)
            .stream().map(this::toTaskResponse).toList();
    }
    public List<TaskResponse> getTasksByAssignee(User assignee) {
        return taskRepository.findByAssigneeId(assignee.getId())
            .stream().map(this::toTaskResponse).toList();
    }
    public Optional<TaskResponse> getTaskById(Long id) {
        return taskRepository.findById(id).map(this::toTaskResponse);
    }
    public TaskResponse updateTask(Long id, TaskUpdateRequest request, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Görev bulunamadı."));
        
        Project project = task.getProject();
        boolean isOwner = project.getOwner().getId().equals(user.getId());
        boolean isAssignee = task.getAssignee() != null && task.getAssignee().getId().equals(user.getId());

        if (!(isOwner || isAssignee)) {
            throw new org.springframework.security.access.AccessDeniedException("Sadece proje sahibi veya görevin atananı durumu güncelleyebilir.");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(TaskStatus.valueOf(request.getStatus()));
        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                .orElseThrow(() -> new RuntimeException("Assignee not found"));
            task.setAssignee(assignee);
        }
        return toTaskResponse(taskRepository.save(task));
    }
    public void deleteTask(Long id, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Görev bulunamadı."));
        
        Project project = task.getProject();
        boolean isOwner = project.getOwner().getId().equals(user.getId());
        
        // Debug logging
        System.out.println("=== DELETE TASK DEBUG ===");
        System.out.println("Task ID: " + id);
        System.out.println("User ID: " + user.getId());
        System.out.println("User Username: " + user.getUsername());
        System.out.println("Project Owner ID: " + project.getOwner().getId());
        System.out.println("Project Owner Username: " + project.getOwner().getUsername());
        System.out.println("Is Owner: " + isOwner);
        System.out.println("=========================");
        
        if (!isOwner) {
            throw new org.springframework.security.access.AccessDeniedException("Sadece proje sahibi görev silebilir.");
        }
        
        taskRepository.delete(task);
    }

    private TaskResponse toTaskResponse(Task task) {
        TaskResponse dto = new TaskResponse();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus() != null ? task.getStatus().name() : null);
        dto.setProjectId(task.getProject() != null ? task.getProject().getId() : null);
        dto.setAssigneeUsername(task.getAssignee() != null ? task.getAssignee().getUsername() : null);
        return dto;
    }
}