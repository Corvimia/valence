import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface SidebarProps {}

export const Sidebar: React.VFC<SidebarProps> = () => {
  const navigate = useNavigate();

  return (
    <Drawer anchor="left" open={true} variant={'permanent'}>
      <List>
        <ListItem button onClick={() => navigate('/')}>
          <ListItemText>Home</ListItemText>
        </ListItem>
        <ListItem button onClick={() => navigate('/players')}>
          <ListItemText>Players</ListItemText>
        </ListItem>
        <ListItem button onClick={() => navigate('/characters')}>
          <ListItemText>Characters</ListItemText>
        </ListItem>
        <ListItem button onClick={() => navigate('/skills')}>
          <ListItemText>Skills</ListItemText>
        </ListItem>
        <ListItem button onClick={() => navigate('/rumours')}>
          <ListItemText>Rumours</ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
};
