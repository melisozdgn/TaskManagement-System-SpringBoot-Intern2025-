import React from 'react';
import { Box, Typography } from '@mui/material';
import CommentItem from './CommentItem';

const CommentList = ({ comments = [], currentUser, onUpdate, onDelete }) => {
  return (
    <Box>
      <Typography variant="subtitle2" mb={1}>Yorumlar</Typography>
      {comments.length === 0 ? (
        <Typography>Henüz yorum yok.</Typography>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))
      )}
    </Box>
  );
};

export default CommentList; 