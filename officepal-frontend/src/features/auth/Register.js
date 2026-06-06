import React, { useState } from 'react';
import { Box, TextField, Typography, Paper } from '@mui/material';
import CustomButton from '../../components/CustomButton';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.username, form.email, form.password);
      navigate('/projects');
    } catch (err) {
      setError('Kayıt başarısız. Bilgilerinizi kontrol edin.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" mb={2} align="center">Kayıt Ol</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Kullanıcı Adı"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="E-posta"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Şifre"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <CustomButton type="submit" fullWidth sx={{ mt: 2 }}>
            Kayıt Ol
          </CustomButton>
        </form>
        <Typography align="center" mt={2}>
          Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register; 