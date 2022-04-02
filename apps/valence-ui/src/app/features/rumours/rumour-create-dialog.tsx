import { Rumour, RumourWithSkill } from './model';
import React from 'react';
import { useController, useForm } from 'react-hook-form';
import { useDialog } from '../core/hooks/use-dialog';
import { api, fetcher } from '../../api';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import useSWR from 'swr';
import { Skill } from '../skill/model';

export interface RumourCreateDialogProps {
  onRumourCreated: (rumour: RumourWithSkill) => Promise<void>;
}

export const RumourCreateDialog: React.VFC<RumourCreateDialogProps> = ({
  onRumourCreated,
}) => {
  const { data: skills = [] } = useSWR<Skill[]>('/api/skills', fetcher);

  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      id: 0,
      text: '',
      skillId: 0,
      threshold: '',
    },
  });

  const textControl = useController({
    name: 'text',
    control: control,
    rules: { required: true },
  });

  const skillIdControl = useController({
    name: 'skillId',
    control: control,
    rules: { required: true },
  });

  const thresholdControl = useController({
    name: 'threshold',
    control: control,
    rules: { required: true },
  });

  const [isOpen, openDialog, closeDialog] = useDialog(reset);

  const createRumour = async (rumour: Rumour) => {
    const { data } = await api.post<RumourWithSkill>('/api/rumours', rumour);

    await onRumourCreated(data);

    closeDialog();
  };

  return (
    <>
      <Button variant="outlined" onClick={openDialog}>
        Add Rumour
      </Button>
      <Dialog open={isOpen} onClose={closeDialog}>
        <form onSubmit={handleSubmit(createRumour)}>
          <DialogTitle>Add Rumour</DialogTitle>
          <DialogContent>
            <Select
              label="Skill"
              value={skillIdControl.field.value}
              onChange={skillIdControl.field.onChange}
            >
              <MenuItem value={0}>Pick</MenuItem>
              {skills?.map((skill) => (
                <MenuItem key={skill.id} value={skill.id}>
                  {skill.name}
                </MenuItem>
              ))}
            </Select>
            <br />
            <TextField
              label="Threshold"
              value={thresholdControl.field.value}
              onChange={thresholdControl.field.onChange}
            />
            <br />
            <TextField
              label="Text"
              value={textControl.field.value}
              onChange={textControl.field.onChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
