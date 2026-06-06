import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Snackbar,
  MenuItem,
  TextField,
  Paper,
  Chip,
  Avatar,
  Stack,
  Divider,
  Button,
} from '@mui/material';
import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';
import { getComments, addComment, updateComment, deleteComment } from '../../services/commentService';
import { getTaskById, updateTask, deleteTask } from '../../services/taskService';
import { useAuth } from '../auth/AuthContext';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const statusOptions = [
  { value: 'TODO', label: 'Yapılacak' },
  { value: 'IN_PROGRESS', label: 'Devam Ediyor' },
  { value: 'COMPLETED', label: 'Tamamlandı' },
];

const statusColors = {
  TODO: 'default',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
};

const TaskDetail = ({ task: propTask, comments: propComments }) => {
  const { id: taskId } = useParams();
  const { token, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const projectMembers = location.state?.members || [];
  const ownerUsername = location.state?.ownerUsername;
  const [task, setTask] = useState(propTask || null);
  const [comments, setComments] = useState(propComments || []);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (taskId && token) {
      fetchTask();
      fetchComments();
    }
  }, [taskId, token]);

  const fetchTask = async () => {
    try {
      const data = await getTaskById(taskId, token);
      setTask(data);
    } catch (err) {
      setTask(null);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await getComments(taskId, token);
      setComments(data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Yorumlar alınamadı.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async ({ content }) => {
    try {
      await addComment(taskId, content, token);
      fetchComments();
      setSnackbar({ open: true, message: 'Yorum eklendi.', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Yorum eklenemedi.', severity: 'error' });
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      await updateComment(commentId, content, token);
      fetchComments();
      setSnackbar({ open: true, message: 'Yorum güncellendi.', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Yorum güncellenemedi.', severity: 'error' });
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId, token);
      fetchComments();
      setSnackbar({ open: true, message: 'Yorum silindi.', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Yorum silinemedi.', severity: 'error' });
    }
  };

  const handleStatusChange = async (e) => {
    try {
      await updateTask(taskId, { ...task, status: e.target.value }, token);
      setTask({ ...task, status: e.target.value });
      setSnackbar({ open: true, message: 'Durum güncellendi.', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Durum güncellenemedi.', severity: 'error' });
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(taskId, token);
      setSnackbar({ open: true, message: 'Görev silindi.', severity: 'success' });
      setTimeout(() => navigate('/projects'), 1000);
    } catch (err) {
      setSnackbar({ open: true, message: 'Görev silinemedi.', severity: 'error' });
    }
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  if (!task) return <Typography>Görev bulunamadı.</Typography>;

  const isAssignee = user && task.assigneeUsername === user.username;
  const isOwner = user && ownerUsername === user.username;
  const canChangeStatus = isAssignee || isOwner;
  const isProjectMember = user && projectMembers.some(m => m.username === user.username);
  const canComment = isProjectMember || isAssignee || isOwner;

  return (
      <Box maxWidth="sm" mx="auto" px={{ xs: 1, sm: 0 }}>
        <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate('/projects')}>
          ← Projeler Sayfasına Geri Dön
        </Button>
        <Paper sx={{ p: { xs: 2, sm: 4 }, mt: 0, mb: 4, boxShadow: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, fontSize: 24 }}>
              {task.title ? task.title[0].toUpperCase() : '?'}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={600}>{task.title}</Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                {task.description || 'Açıklama yok.'}
              </Typography>
            </Box>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2} alignItems={{ sm: 'center' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Proje Sahibi:</Typography>
              <Chip label={ownerUsername || '-'} size="small" sx={{ ml: 1 }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Atanan:</Typography>
              <Chip label={task.assigneeUsername || '-'} size="small" color="info" sx={{ ml: 1 }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Durum:</Typography>
              {canChangeStatus ? (
                  <TextField
                      select
                      name="status"
                      value={task.status}
                      onChange={handleStatusChange}
                      size="small"
                      sx={{ width: 160, ml: 1 }}
                  >
                    {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </TextField>
              ) : (
                  <Chip
                      label={statusOptions.find(opt => opt.value === task.status)?.label || task.status}
                      color={statusColors[task.status] || 'default'}
                      size="small"
                      sx={{ ml: 1 }}
                  />
              )}
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={1}>Açıklama</Typography>
            <Typography variant="body2" color="text.secondary">
              {task.description || 'Açıklama yok.'}
            </Typography>
          </Box>

          {isOwner && (
              <Button variant="contained" color="error" onClick={handleDeleteTask}>
                Görevi Sil
              </Button>
          )}

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="subtitle1" fontWeight={500} mb={1}>Yorumlar</Typography>
            {canComment && <CommentForm onSubmit={handleAddComment} />}
            <CommentList
                comments={comments}
                currentUser={user}
                onUpdate={handleUpdateComment}
                onDelete={handleDeleteComment}
            />
          </Box>
        </Paper>

        <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            message={snackbar.message}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
  );
};

export default TaskDetail;

