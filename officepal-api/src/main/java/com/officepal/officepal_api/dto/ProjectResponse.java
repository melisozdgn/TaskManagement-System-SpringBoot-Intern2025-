package com.officepal.officepal_api.dto;

public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private String ownerUsername;
    private java.util.List<MemberDto> members;
    public static class MemberDto {
        public Long id;
        public String username;
        public String email;
        public MemberDto(Long id, String username, String email) {
            this.id = id;
            this.username = username;
            this.email = email;
        }
    }
    // Optionally, add List<TaskSummary> tasks if needed

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }
    public java.util.List<MemberDto> getMembers() { return members; }
    public void setMembers(java.util.List<MemberDto> members) { this.members = members; }
} 