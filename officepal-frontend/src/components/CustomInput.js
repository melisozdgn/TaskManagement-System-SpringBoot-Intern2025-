import React from 'react';
import TextField from '@mui/material/TextField';

const CustomInput = ({ label, ...props }) => {
  return (
    <TextField label={label} variant="outlined" fullWidth margin="normal" {...props} />
  );
};

export default CustomInput; 