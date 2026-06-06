import React, { useState } from 'react';
import { Paper, Typography, IconButton, Box, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomButton from '../../components/CustomButton';

const CommentItem = ({ comment, currentUser, onUpdate, onDelete }) => {
  const isOwner = currentUser && comment.authorUsername === currentUser.username;
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setEditContent(comment.content);
  };
  const handleSave = () => {
    if (onUpdate && editContent.trim()) {
      onUpdate(comment.id, editContent);
      setEditing(false);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 1 }}>
      {editing ? (
        <Box>
          <TextField
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            sx={{ mb: 1 }}
          />
          <CustomButton size="small" onClick={handleSave} sx={{ mr: 1 }}>Kaydet</CustomButton>
          <CustomButton size="small" onClick={handleCancel} color="secondary">İptal</CustomButton>
        </Box>
      ) : (
        <>
          <Typography variant="body2">{comment.content}</Typography>
          <Typography variant="caption" color="text.secondary">
            {comment.authorUsername} - {new Date(comment.createdAt).toLocaleString()}
          </Typography>
          {isOwner && (
            <Box sx={{ float: 'right' }}>
              <IconButton size="small" onClick={handleEdit}><EditIcon fontSize="small" /></IconButton>
              <IconButton size="small" color="error" onClick={() => onDelete(comment.id)}><DeleteIcon fontSize="small" /></IconButton>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default CommentItem; 