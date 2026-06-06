import React, { useState } from 'react';
import { Box, TextField, Typography, Paper, Alert } from '@mui/material';
import CustomButton from '../../components/CustomButton';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Try login with username first, then with email if it fails
      await login(form.usernameOrEmail, form.password);
      navigate('/projects');
    } catch (err) {
      setError('Giriş başarısız. Bilgilerinizi kontrol edin.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" mb={2} align="center">Giriş Yap</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Kullanıcı Adı veya E-posta"
            name="usernameOrEmail"
            value={form.usernameOrEmail}
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
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <CustomButton type="submit" fullWidth sx={{ mt: 2 }}>
            Giriş Yap
          </CustomButton>
        </form>
        <Typography align="center" mt={2}>
          Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login; 