import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
import CustomButton from '../../components/CustomButton';

const CommentForm = ({ onSubmit }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit && content.trim()) {
      onSubmit({ content });
      setContent('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Yorumunuz"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        multiline
        minRows={2}
        required
      />
      <CustomButton type="submit" sx={{ mt: 1 }}>
        Yorum Ekle
      </CustomButton>
    </Box>
  );
};

export default CommentForm; 