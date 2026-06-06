import React from 'react';
import { Card, CardContent, CardActions, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();
  return (
    <Card sx={{ minWidth: 250, maxWidth: 400, m: 'auto', boxShadow: 3, borderRadius: 3, cursor: 'pointer' }}
      onClick={() => navigate(`/projects/${project.id}`)}>
      <CardContent>
        <Typography variant="h6" gutterBottom noWrap>
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
          {project.description || 'Açıklama yok.'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Sahip: {project.ownerUsername || '-'}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
        <IconButton aria-label="Düzenle" onClick={onEdit} size="small">
          <EditIcon />
        </IconButton>
        <IconButton aria-label="Sil" onClick={onDelete} size="small" color="error">
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ProjectCard; 