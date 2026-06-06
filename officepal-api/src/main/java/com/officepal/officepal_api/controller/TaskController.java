package com.officepal.officepal_api.controller;

import com.officepal.officepal_api.service.TaskService;
import com.officepal.officepal_api.entity.Task;
import com.officepal.officepal_api.entity.Project;
import com.officepal.officepal_api.entity.User;
import com.officepal.officepal_api.dto.TaskCreateRequest;
import com.officepal.officepal_api.dto.TaskUpdateRequest;
import com.officepal.officepal_api.dto.TaskResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PostMapping
    public TaskResponse createTask(@RequestBody TaskCreateRequest request, @AuthenticationPrincipal User user) {
        return taskService.createTask(request, user);
    }

    @GetMapping("/project/{projectId}")
    public List<TaskResponse> getTasksByProject(@PathVariable Long projectId) {
        return taskService.getTasksByProject(projectId);
    }

    @GetMapping("/assignee")
    public List<TaskResponse> getTasksByAssignee(@AuthenticationPrincipal User user) {
        return taskService.getTasksByAssignee(user);
    }

    @GetMapping("/{id}")
    public Optional<TaskResponse> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    @PutMapping("/{id}")
    public TaskResponse updateTask(@PathVariable Long id, @RequestBody TaskUpdateRequest request, @AuthenticationPrincipal User user) {
        return taskService.updateTask(id, request, user);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id, @AuthenticationPrincipal User user) {
        taskService.deleteTask(id, user);
    }
}