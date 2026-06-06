package com.officepal.officepal_api.dto;

public class CommentCreateRequest {
    private String content;
    private Long taskId;
 
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }
} 