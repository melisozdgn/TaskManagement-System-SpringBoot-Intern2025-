## 2025 - Summer Intern 
# OfficePal - Task Management System

## 📖 Project Overview
OfficePal is a secure task management system developed as an internship project at Interprobe[cite: 2]. It allows internal teams to regularly track their projects and tasks within a secure system, making workplaces more efficient and effective[cite: 2]. The system provides ease of use and flexibility by enabling users to create projects, assign tasks, and manage their statuses[cite: 2]. 

---

## 🚀 Features

### 1. Project Management
* Users can create new projects to organize team workflows.
* The system ensures that each user can only view their own projects[cite: 2].

### 2. Task Management
* Users can create tasks within projects and assign them to users[cite: 2].
* Users can update their task status in three different ways: TODO, IN_PROGRESS, and COMPLETED[cite: 2].

### 3. Comment System
* Users can leave comments on assigned tasks through the comment system to facilitate team communication[cite: 2].
* Users can only edit or delete their own comments[cite: 2].

### 4. Authentication & Security
* The system implements JWT-based authorization and authentication to ensure system security[cite: 2].
* The JWT token system automatically rejects requests that have expired or lack tokens, ensuring that only eligible users can view their projects and tasks[cite: 2].

---

## 🛠️ Technology Stack

* **Backend:** REST APIs were created on the backend using Java Spring Boot[cite: 2].
* **Frontend:** React.js was used for the frontend to create an interface that allows users to easily manage their tasks, projects, and comments[cite: 2].
* **Database:** Data management was achieved with a PostgreSQL database, creating project, task, comment, and user tables[cite: 2].
* **Containerization & Deployment:** Docker was used for containerization and deployment during the development process[cite: 2].
* **Project Tracking:** Jira was used for project planning and task tracking[cite: 2]. Sprint-based progress planning was implemented using the Agile methodology[cite: 2].

---

## 🏗️ System Architecture

The backend utilizes a layered architecture, which is the basic component of the system[cite: 2]. This architecture facilitates scalability and maintenance, making the system more effective and efficient[cite: 2]. 

* **Controller Layer:** Manages API endpoints[cite: 2].
* **Service Layer:** Manages business logic[cite: 2].
* **Repository Layer:** Manages database communication[cite: 2].
* **DTOs (Data Transfer Objects):** Ensure the front end receives only the necessary information[cite: 2].

By using this architecture, code readability and system efficiency have been increased and system security has been fully ensured[cite: 2].

---

## 🔐 Security & Authorization Rules

### Spring Security Configuration
* **Public Access:** The `/auth/register` and `/auth/login` endpoints are freely accessible for user onboarding.
* **Protected Areas:** All other API endpoints (projects, tasks, comments) are strictly protected.
* **Token Implementation:** Upon login, users receive a JWT token. All requests to protected endpoints must include this token in the header as `Authorization: Bearer <token>`. Requests without a token will automatically return a `401 Unauthorized` error.

### Access Control
* **Projects:** Users have exclusive visibility over the projects they create.
* **Tasks:** Users can only add tasks to their own projects. Assigned users can view their specific tasks and update the statuses.
* **Comments:** Comments are visible to any user authorized to view the task, but modification/deletion rights belong solely to the comment author.

---

## 📋 Example Scenario

**1. Project Creation and Task Assignment**
* **Ahmet** logs into the system and creates a project named *"Web Sitesi Yenileme"*.
* He defines two tasks under this project:
  * *"Tasarım hazırla"* → Assigned to **Ahmet**.
  * *"API bağlantısını yap"* → Assigned to **Zeynep**.

**2. Task Tracking and Collaboration**
* **Zeynep** logs in, views her assigned task, and updates its status to `IN_PROGRESS`.
* Both users collaborate via comments under their respective tasks:
  * **Ahmet:** *"Tasarım Figma’da tamamlandı."*
  * **Zeynep:** *"API uç noktaları test edildi."*

**3. Strict Access Control**
* As the project owner, **Ahmet** has full access to the entire project.
* **Zeynep** can strictly *only* view the task assigned to her and the comments left on that specific task.
