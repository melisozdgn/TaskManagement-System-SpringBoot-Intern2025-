import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Checkbox, ListItemText } from '@mui/material';
import CustomButton from '../../components/CustomButton';
import { getAllUsers } from '../../services/authService';
import { useAuth } from '../auth/AuthContext';

const ProjectForm = ({ onSubmit, initialData = {} }) => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    members: initialData.members || [],
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getAllUsers(token);
        setUsers(data);
      } catch (e) {
        setUsers([]);
      }
    }
    fetchUsers();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleMembersChange = (e) => {
    setForm({ ...form, members: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" mb={2}>Proje Oluştur</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Proje Adı"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Açıklama"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Proje Üyeleri</InputLabel>
          <Select
            multiple
            value={form.members}
            onChange={handleMembersChange}
            input={<OutlinedInput label="Proje Üyeleri" />}
            renderValue={(selected) =>
              users.filter(u => selected.includes(u.id)).map(u => u.username).join(', ')
            }
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Checkbox checked={form.members.indexOf(user.id) > -1} />
                <ListItemText primary={user.username} secondary={user.email} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <CustomButton type="submit" sx={{ mt: 2 }}>
          Kaydet
        </CustomButton>
      </form>
    </Paper>
  );
};

export default ProjectForm; 