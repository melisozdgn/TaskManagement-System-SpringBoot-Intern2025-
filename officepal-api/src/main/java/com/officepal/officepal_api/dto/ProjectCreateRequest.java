package com.officepal.officepal_api.dto;

public class ProjectCreateRequest {
    private String title;
    private String description;
    private java.util.List<Long> members;
 
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public java.util.List<Long> getMembers() { return members; }
    public void setMembers(java.util.List<Long> members) { this.members = members; }
} 