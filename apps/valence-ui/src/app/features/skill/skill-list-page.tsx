import React from 'react';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import useSWR from 'swr';
import { api, fetcher } from '../../api';
import { Skill } from './model';
import SkillCreateDialog from './skill-create-dialog';

export interface SkillPageProps {}

export const SkillListPage: React.VFC<SkillPageProps> = () => {
  const { data: skills = [], mutate } = useSWR<Skill[]>('/api/skills', fetcher);

  const deleteSkill = async (skillId: number) => {
    await mutate(
      async () => {
        await api.delete<Skill>(`/api/skills/${skillId}`);
        return [];
      },
      {
        optimisticData: [...skills],
        rollbackOnError: true,
        populateCache: () => {
          return [...skills];
        },
        revalidate: true,
      }
    );
  };

  const onSkillCreated = async (skill: Skill) => {
    await mutate(() => [skill], {
      optimisticData: [...skills],
      rollbackOnError: true,
      populateCache: (newItem) => {
        return [...skills, ...newItem];
      },
      revalidate: true,
    });
  };

  return (
    <>
      <Typography variant="h3">Skills</Typography>
      <SkillCreateDialog onSkillChanged={onSkillCreated} />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {skills?.map((skill) => (
            <TableRow key={skill.id ?? 'new'}>
              <TableCell>{skill.id}</TableCell>
              <TableCell>{skill.name}</TableCell>
              <TableCell>{skill.type}</TableCell>
              <TableCell>
                <IconButton onClick={() => deleteSkill(skill.id)}>
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
