import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Chip,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormHelperText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskList from '../tasks/TaskList';
import TaskForm from '../tasks/TaskForm';
import { useParams } from 'react-router-dom';
import { getProjectById, updateProject } from '../../services/projectService';
import { getTasksByProjectId, createTask, deleteTask } from '../../services/taskService';
import { useAuth } from '../auth/AuthContext';
import { getAllUsers } from '../../services/authService';

const ProjectDetail = () => {
  const { id: projectId } = useParams();
  const { token, user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [addMemberLoading, setAddMemberLoading] = useState(false);

  useEffect(() => {
    if (projectId && token) {
      fetchProjectAndTasks();
    }
  }, [projectId, token]);

  useEffect(() => {
    if (addMemberDialogOpen && token) {
      getAllUsers(token).then(setAllUsers).catch(() => setAllUsers([]));
    }
  }, [addMemberDialogOpen, token]);

  const fetchProjectAndTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const proj = await getProjectById(projectId, token);
      setProject(proj);
      const taskList = await getTasksByProjectId(projectId, token);
      setTasks(taskList);
    } catch (err) {
      setError('Proje veya görevler alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (form) => {
    try {
      await createTask({ ...form, projectId }, token);
      setSnackbar({ open: true, message: 'Görev oluşturuldu.', severity: 'success' });
      fetchProjectAndTasks();
      setDialogOpen(false);
    } catch (err) {
      setSnackbar({ open: true, message: 'Görev oluşturulamadı.', severity: 'error' });
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId, token);
      setSnackbar({ open: true, message: 'Görev silindi.', severity: 'success' });
      fetchProjectAndTasks();
    } catch (err) {
      // Don't show error if task was already deleted successfully
      // Just refresh the task list
      fetchProjectAndTasks();
    }
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleOpenAddMember = () => {
    setSelectedMembers(project.members ? project.members.map(m => m.id) : []);
    setAddMemberDialogOpen(true);
  };

  const handleCloseAddMember = () => setAddMemberDialogOpen(false);

  const handleAddMemberChange = (e) => {
    setSelectedMembers(e.target.value);
  };

  const handleAddMembersSubmit = async (e) => {
    e.preventDefault();
    setAddMemberLoading(true);
    try {
      await updateProject(project.id, {
        title: project.title,
        description: project.description,
        members: selectedMembers
      }, token);
      setSnackbar({ open: true, message: 'Üyeler güncellendi.', severity: 'success' });
      setAddMemberDialogOpen(false);
      fetchProjectAndTasks();
    } catch (err) {
      setSnackbar({ open: true, message: 'Üyeler güncellenemedi.', severity: 'error' });
    } finally {
      setAddMemberLoading(false);
    }
  };

  if (loading) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
    );
  }
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!project) return <Typography>Proje bulunamadı.</Typography>;

  const isOwner = project.ownerUsername && user && user.username === project.ownerUsername;

  return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>{project.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary">{project.description}</Typography>
          <Typography variant="caption" color="text.secondary">
            Proje Sahibi: {project.ownerUsername}
          </Typography>
        </Paper>

        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="h6">Proje Üyeleri</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip label={`Toplam: ${project.members ? project.members.length : 0}`} />
              <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<AddIcon />}
                  disabled={!isOwner}
                  sx={{ minWidth: 0, px: 2 }}
                  onClick={handleOpenAddMember}
              >
                Üye Ekle
              </Button>
            </Stack>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {project.members && project.members.map((member) => (
                <Chip
                    key={member.id}
                    avatar={<Avatar>{member.username[0].toUpperCase()}</Avatar>}
                    label={member.username}
                    variant="outlined"
                    sx={{ mb: 1 }}
                />
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="h5" mb={2}>Görevler</Typography>
          {tasks.length > 0 ? (
              <Stack spacing={2}>
                {tasks.map((task) => (
                    <TaskList
                        key={task.id}
                        tasks={[task]}
                        members={project.members || []}
                        ownerUsername={project.ownerUsername}
                        fullWidth
                        onDelete={isOwner ? () => handleDeleteTask(task.id) : null}
                    />
                ))}
              </Stack>
          ) : (
              <Box p={2}>Henüz görev yok.</Box>
          )}
        </Box>

      {isOwner && (
        <>
          <Fab color="primary" aria-label="Görev Ekle" onClick={() => setDialogOpen(true)} sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}>
            <AddIcon />
          </Fab>
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Yeni Görev Oluştur</DialogTitle>
            <DialogContent>
              <TaskForm onSubmit={handleCreateTask} members={project.members || []} />
            </DialogContent>
          </Dialog>
        </>
      )}
      <Dialog open={addMemberDialogOpen} onClose={handleCloseAddMember} maxWidth="xs" fullWidth>
        <DialogTitle>Üye Ekle</DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddMembersSubmit}>
            <Box mt={2} mb={2}>
              <FormControl fullWidth>
                <InputLabel id="add-member-label">Kullanıcılar</InputLabel>
                <Select
                  labelId="add-member-label"
                  multiple
                  value={selectedMembers}
                  onChange={handleAddMemberChange}
                  renderValue={(selected) =>
                    allUsers.filter(u => selected.includes(u.id)).map(u => u.username).join(', ')
                  }
                >
                  {allUsers.length === 0 && (
                    <MenuItem disabled>
                      <ListItemText primary="Kullanıcı bulunamadı" />
                    </MenuItem>
                  )}
                  {allUsers.map(user => (
                    <MenuItem key={user.id} value={user.id} disabled={project.ownerUsername === user.username}>
                      <Checkbox checked={selectedMembers.indexOf(user.id) > -1} />
                      <ListItemText primary={user.username} secondary={user.email} />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Bir veya daha fazla kullanıcı seçin</FormHelperText>
              </FormControl>
            </Box>
            <Button type="submit" variant="contained" color="primary" disabled={addMemberLoading} fullWidth>
              Kaydet
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};

export default ProjectDetail; 