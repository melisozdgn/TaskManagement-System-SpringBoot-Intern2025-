import React from 'react';
import Button from '@mui/material/Button';

const CustomButton = ({ children, variant = 'contained', color = 'primary', ...props }) => {
  return (
    <Button variant={variant} color={color} {...props}>
      {children}
    </Button>
  );
};

export default CustomButton; 