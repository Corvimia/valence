import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useController, useForm } from 'react-hook-form';
import { Skill, SkillType } from './model';
import { api } from '../../api';
import { useDialog } from '../core/hooks/use-dialog';

export interface SkillCreateDialogProps {
  onSkillChanged: (skill: Skill) => Promise<void>;
}

export const SkillCreateDialog: React.VFC<SkillCreateDialogProps> = ({
  onSkillChanged,
}) => {
  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      id: 0,
      name: '',
    },
  });

  const nameControl = useController({
    name: 'name',
    control: control,
    rules: { required: true },
  });

  const typeControl = useController({
    name: 'type',
    control: control,
    defaultValue: SkillType.basic,
    rules: { required: true },
  });

  const [isOpen, openDialog, closeDialog] = useDialog(reset);

  const createSkill = async (skill: Skill) => {
    const { data } = await api.post<Skill>('/api/skills', skill);

    await onSkillChanged(data);

    closeDialog();
  };

  return (
    <>
      <Button variant="outlined" onClick={openDialog}>
        Add Skill
      </Button>
      <Dialog open={isOpen} onClose={closeDialog}>
        <form onSubmit={handleSubmit(createSkill)}>
          <DialogTitle>New Skill</DialogTitle>
          <DialogContent>
            <DialogContentText>Create a new skill</DialogContentText>

            <TextField
              label="Name"
              variant="filled"
              value={nameControl.field.value}
              onChange={nameControl.field.onChange}
            />
            <br />
            <Select
              value={typeControl.field.value}
              label="Type"
              onChange={typeControl.field.onChange}
            >
              {Object.keys(SkillType)?.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default SkillCreateDialog;
