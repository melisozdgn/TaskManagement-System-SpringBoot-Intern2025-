import React from 'react';
import { Stack, Box } from '@mui/material';
import TaskCard from './TaskCard';

const TaskList = ({ tasks = [], members = [], ownerUsername, onDelete }) => {
    return (
        <Stack spacing={2} width="100%">
            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        members={members}
                        ownerUsername={ownerUsername}

                        onDelete={onDelete}
                    />
                ))
            ) : (
                <Box p={2}>Henüz görev yok.</Box>
            )}
        </Stack>
    );
};

export default TaskList;

