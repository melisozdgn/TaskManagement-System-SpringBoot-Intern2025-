import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Button, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { deleteTask } from '../../services/taskService';

const statusColors = {
    TODO: 'default',
    IN_PROGRESS: 'warning',
    COMPLETED: 'success',
};

const TaskCard = ({ task, members, ownerUsername, fullWidth, onDelete }) => {
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

    const handleDelete = async (e) => {
        e.stopPropagation();
        
        // Check if user is the project owner
        const isOwner = ownerUsername && user && user.username === ownerUsername;
        
        if (!isOwner) {
            setSnackbar({ open: true, message: 'Sadece proje sahibi görev silebilir.', severity: 'error' });
            return;
        }

        try {
            await deleteTask(task.id, token);
            setSnackbar({ open: true, message: 'Görev başarıyla silindi.', severity: 'success' });
            
            // Call the onDelete callback if provided (for parent component to refresh)
            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Görev silinirken hata oluştu.', severity: 'error' });
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <>
            <Card
                sx={{
                    mb: 2,
                    cursor: 'pointer',
                    width: '100%',
                    display: 'block',
                    boxShadow: 3,
                    position: 'relative'
                }}
                onClick={() => navigate(`/tasks/${task.id}`, { state: { members, ownerUsername } })}
            >
                <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8, 
                        zIndex: 2,
                        minWidth: 'auto',
                        px: 1
                    }}
                    onClick={handleDelete}
                >
                    Sil
                </Button>

                <CardContent>
                    <Typography variant="subtitle1">{task.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{task.description}</Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                        <Chip label={task.status} color={statusColors[task.status] || 'default'} size="small" sx={{ mr: 1 }} />
                        {task.assigneeUsername && (
                            <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                                Atanan: {task.assigneeUsername}
                            </Typography>
                        )}
                    </Box>
                    {ownerUsername && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Proje Sahibi: {ownerUsername}
                        </Typography>
                    )}
                </CardContent>
            </Card>
            
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default TaskCard; 