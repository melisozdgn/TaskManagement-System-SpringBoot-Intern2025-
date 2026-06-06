package com.officepal.officepal_api.service;

import com.officepal.officepal_api.repository.CommentRepository;
import com.officepal.officepal_api.repository.TaskRepository;
import com.officepal.officepal_api.repository.UserRepository;
import com.officepal.officepal_api.entity.Comment;
import com.officepal.officepal_api.entity.Task;
import com.officepal.officepal_api.entity.User;
import com.officepal.officepal_api.entity.Project;
import com.officepal.officepal_api.dto.CommentCreateRequest;
import com.officepal.officepal_api.dto.CommentUpdateRequest;
import com.officepal.officepal_api.dto.CommentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public CommentResponse addComment(Long taskId, CommentCreateRequest request, User user) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        Project project = task.getProject();

        // Debug logging
        System.out.println("Current User ID: " + user.getId());
        System.out.println("Project Owner ID: " + project.getOwner().getId());
        if (task.getAssignee() != null) {
            System.out.println("Task Assignee ID: " + task.getAssignee().getId());
        } else {
            System.out.println("Task Assignee ID: null");
        }
        if (project.getMembers() != null) {
            System.out.println("Project Member IDs: " + project.getMembers().stream().map(User::getId).toList());
        } else {
            System.out.println("Project Member IDs: null or empty");
        }

        boolean isOwner = project.getOwner().getId().equals(user.getId());
        boolean isMember = project.getMembers() != null && project.getMembers().stream().anyMatch(m -> m.getId().equals(user.getId()));
        boolean isAssignee = task.getAssignee() != null && task.getAssignee().getId().equals(user.getId());

        System.out.println("Permissions: isOwner=" + isOwner + ", isMember=" + isMember + ", isAssignee=" + isAssignee);

        if (!(isOwner || isMember || isAssignee)) {
            throw new org.springframework.security.access.AccessDeniedException("Yalnızca proje sahibi, proje üyeleri veya görevin atananı yorum yapabilir.");
        }
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setTask(task);
        comment.setAuthor(user);
        return toCommentResponse(commentRepository.save(comment));
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByTask(Long taskId) {
        return commentRepository.findByTaskId(taskId)
            .stream().map(this::toCommentResponse).toList();
    }

    @Transactional
    public CommentResponse updateComment(Long id, CommentUpdateRequest request, User user) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Yorum bulunamadı."));
        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("Bu yorumu güncelleme yetkiniz yok.");
        }
        comment.setContent(request.getContent());
        return toCommentResponse(commentRepository.save(comment));
    }

    @Transactional
    public void deleteComment(Long id, User user) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Yorum bulunamadı."));
        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("Bu yorumu silme yetkiniz yok.");
        }
        commentRepository.delete(comment);
    }

    public CommentResponse toCommentResponse(Comment comment) {
        CommentResponse dto = new CommentResponse();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setAuthorUsername(comment.getAuthor() != null ? comment.getAuthor().getUsername() : null);
        dto.setTaskId(comment.getTask() != null ? comment.getTask().getId() : null);
        dto.setCreatedAt(comment.getCreatedAt() != null ? comment.getCreatedAt().toString() : null);
        return dto;
    }
}