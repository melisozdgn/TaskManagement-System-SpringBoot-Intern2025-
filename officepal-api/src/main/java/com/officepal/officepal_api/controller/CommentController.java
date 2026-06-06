package com.officepal.officepal_api.controller;

import com.officepal.officepal_api.service.CommentService;
import com.officepal.officepal_api.entity.Comment;
import com.officepal.officepal_api.entity.Task;
import com.officepal.officepal_api.entity.User;
import com.officepal.officepal_api.dto.CommentUpdateRequest;
import com.officepal.officepal_api.dto.CommentResponse;
import com.officepal.officepal_api.dto.CommentCreateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @PostMapping("/task/{taskId}")
    public CommentResponse addComment(@PathVariable Long taskId, @RequestBody CommentCreateRequest request, @AuthenticationPrincipal User user) {
        return commentService.addComment(taskId, request, user);
    }

    @GetMapping("/task/{taskId}")
    public List<CommentResponse> getCommentsByTask(@PathVariable Long taskId) {
        return commentService.getCommentsByTask(taskId);
    }

    @PutMapping("/{id}")
    public CommentResponse updateComment(@PathVariable Long id, @RequestBody CommentUpdateRequest request, @AuthenticationPrincipal User user) {
        return commentService.updateComment(id, request, user);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id, @AuthenticationPrincipal User user) {
        commentService.deleteComment(id, user);
    }
}