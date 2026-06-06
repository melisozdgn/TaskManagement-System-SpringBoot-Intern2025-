import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ProjectForm from './ProjectForm';
import ProjectCard from './ProjectCard';
import { getProjects, getProjectsByMember, createProject, updateProject, deleteProject } from '../../services/projectService';
import { useAuth } from '../auth/AuthContext';

const ProjectList = () => {
  const { token } = useAuth();
  const [ownedProjects, setOwnedProjects] = useState([]);
  const [memberProjects, setMemberProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const [owned, member] = await Promise.all([
        getProjects(token),
        getProjectsByMember(token),
      ]);
      setOwnedProjects(owned);
      setMemberProjects(member.filter(p => !owned.some(o => o.id === p.id)));
    } catch (err) {
      setError('Projeler alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  const handleCreateClick = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingProject(null);
  };

  const handleFormSubmit = async (form) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, form, token);
        setSnackbar({ open: true, message: 'Proje güncellendi.', severity: 'success' });
      } else {
        await createProject(form, token);
        setSnackbar({ open: true, message: 'Proje oluşturuldu.', severity: 'success' });
      }
      fetchProjects();
      handleDialogClose();
    } catch (err) {
      setSnackbar({ open: true, message: 'İşlem başarısız.', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id, token);
      setSnackbar({ open: true, message: 'Proje silindi.', severity: 'success' });
      fetchProjects();
    } catch (err) {
      setSnackbar({ open: true, message: 'Proje silinemedi.', severity: 'error' });
    }
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Typography variant="h5" mb={3} align="center">Projelerim</Typography>
        {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
        ) : error ? (
            <Alert severity="error">{error}</Alert>
        ) : (
            <>
              <Typography variant="h6" mb={2}>Sahibi Olduğunuz Projeler</Typography>
              <Grid container spacing={3} mb={4}>
                {ownedProjects.length === 0 ? (
                    <Typography align="center" sx={{ width: '100%' }}>Henüz bir projeniz yok.</Typography>
                ) : (
                    ownedProjects.map((project) => (
                        <Grid item xs={12} sm={6} md={4} key={project.id}>
                          <ProjectCard
                              project={project}
                              onEdit={() => handleEdit(project)}
                              onDelete={() => handleDelete(project.id)}
                          />
                        </Grid>
                    ))
                )}
              </Grid>
              <Typography variant="h6" mb={2}>Üyesi Olduğunuz Projeler</Typography>
              <Grid container spacing={3}>
                {memberProjects.length === 0 ? (
                    <Typography align="center" sx={{ width: '100%' }}>Üyesi olduğunuz başka proje yok.</Typography>
                ) : (
                    memberProjects.map((project) => (
                        <Grid item xs={12} sm={6} md={4} key={project.id}>
                          <ProjectCard
                              project={project}
                              onEdit={null}
                              onDelete={null}
                          />
                        </Grid>
                    ))
                )}
              </Grid>
            </>
        )}
        <Fab
            color="primary"
            aria-label="Proje Ekle"
            onClick={handleCreateClick}
            sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}
        >
          <AddIcon />
        </Fab>
        <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ m: 0, p: 2, position: 'relative' }}>
            {editingProject ? 'Projeyi Düzenle' : 'Yeni Proje Oluştur'}
            <IconButton
                aria-label="close"
                onClick={handleDialogClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'black',
                }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <ProjectForm
                initialData={editingProject || {}}
                onSubmit={handleFormSubmit}
            />
          </DialogContent>
        </Dialog>
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

export default ProjectList;
