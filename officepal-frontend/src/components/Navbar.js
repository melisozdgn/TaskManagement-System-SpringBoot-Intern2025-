import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Navbar = ({ onLogout, isAuthenticated }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          OfficePal
        </Typography>
        {isAuthenticated ? (
          <Button color="inherit" onClick={onLogout}>Çıkış Yap</Button>
        ) : null}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 