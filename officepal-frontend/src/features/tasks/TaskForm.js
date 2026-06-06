import React, { useState } from 'react';
import { Box, TextField, Typography, MenuItem, Paper, FormControl, InputLabel, Select } from '@mui/material';
import CustomButton from '../../components/CustomButton';

const statusOptions = [
  { value: 'TODO', label: 'Yapılacak' },
  { value: 'IN_PROGRESS', label: 'Devam Ediyor' },
  { value: 'COMPLETED', label: 'Tamamlandı' },
];

const TaskForm = ({ onSubmit, initialData = {}, members = [] }) => {
  const [form, setForm] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    status: initialData.status || 'TODO',
    assigneeId: initialData.assigneeId || '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" mb={2}>Görev Oluştur</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Başlık"
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
        <TextField
          select
          label="Durum"
          name="status"
          value={form.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <FormControl fullWidth margin="normal">
          <InputLabel>Atanan Üye</InputLabel>
          <Select
            name="assigneeId"
            value={form.assigneeId}
            onChange={handleChange}
            label="Atanan Üye"
          >
            <MenuItem value=""><em>Seçiniz</em></MenuItem>
            {members.map((member) => (
              <MenuItem key={member.id} value={member.id}>{member.username} ({member.email})</MenuItem>
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

export default TaskForm; 