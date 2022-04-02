import { Rumour, RumourWithSkill } from './model';
import useSWR from 'swr';
import { api, fetcher } from '../../api';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { RumourCreateDialog } from './rumour-create-dialog';

export const RumourListPage: React.VFC = () => {
  const { data: rumours = [], mutate } = useSWR<RumourWithSkill[]>(
    '/api/rumours',
    fetcher
  );

  const deleteRumour = async (rumourId: number) => {
    await mutate(
      async () => {
        await api.delete<Rumour>(`/api/rumours/${rumourId}`);
        return [];
      },
      {
        optimisticData: [...rumours],
        rollbackOnError: true,
        populateCache: () => [...rumours],
        revalidate: true,
      }
    );
  };

  const onRumourCreated = async (rumour: RumourWithSkill) => {
    await mutate(() => [rumour], {
      rollbackOnError: true,
      populateCache: (newRumour) => [...rumours],
      revalidate: true,
    });
  };

  return (
    <>
      <Typography variant="h3">Rumours</Typography>
      <RumourCreateDialog onRumourCreated={onRumourCreated} />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Skill</TableCell>
            <TableCell>Text</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rumours?.map((rumour) => (
            <TableRow key={rumour.id}>
              <TableCell>{rumour.id}</TableCell>
              <TableCell style={{ whiteSpace: 'nowrap' }}>
                {rumour.skill.name} {rumour.threshold}
              </TableCell>
              <TableCell>{rumour.text}</TableCell>
              <TableCell>
                <IconButton onClick={() => deleteRumour(rumour.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
