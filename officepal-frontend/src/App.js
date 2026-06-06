import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ProjectList from './features/projects/ProjectList';
import ProjectDetail from './features/projects/ProjectDetail';
import TaskDetail from './features/tasks/TaskDetail';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './features/auth/AuthContext';

function AppRoutes() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ProjectList />
          </ProtectedRoute>
        } />
        <Route path="/projects/:id" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ProjectDetail />
          </ProtectedRoute>
        } />
        <Route path="/tasks/:id" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <TaskDetail />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/projects" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;