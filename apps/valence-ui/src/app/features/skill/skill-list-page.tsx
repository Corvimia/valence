import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { useController, useForm } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import useSWR, {} from "swr";
import { api, fetcher } from "../../api";
import { Skill } from "@prisma/client";

export interface SkillPageProps {
}

export const SkillListPage: React.VFC<SkillPageProps> = () => {

  const { handleSubmit, reset, control, setValue } = useForm({
    defaultValues: {
      id: 0,
      name: ""
    }
  });

  const nameControl = useController({
    name: "name",
    control: control,
    rules: { required: true }
  });

  const idControl = useController({
    name: "id",
    control: control
  });

  const { data: skills = [], mutate } = useSWR<Skill[]>("/api/skills", fetcher);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const updateSkill = async (skill: Skill) => {
    await mutate(async () => {
      const { data } = await api.put<Skill>(`/api/skills/${skill.id}`, skill);

      closeDialog();

      return [data];
    }, {
      optimisticData: [...skills],
      rollbackOnError: true,
      populateCache: newItem => {
        return [...skills];
      },
      revalidate: true
    });
  };

  const createSkill = async (skill: Skill) => {
    if (skill.id) {
      return updateSkill(skill);
    }
    await mutate(async () => {
      const { data } = await api.post<Skill>("/api/skills", skill);

      closeDialog();

      return [data];
    }, {
      rollbackOnError: true,
      populateCache: newItem => {
        return [...skills, ...newItem];
      },
      revalidate: true
    });
  };

  const deleteSkill = async (skillId: number) => {
    await mutate(async () => {
      await api.delete<Skill>(`/api/skills/${skillId}`);
      return [];
    }, {
      optimisticData: [...skills],
      rollbackOnError: true,
      populateCache: () => {
        return [...skills];
      },
      revalidate: true
    });
  };

  const editSkill = (skill: Skill) => {
    setValue("id", skill.id);
    setValue("name", skill.name);
    openDialog();
  };

  const closeDialog = () => {
    reset();
    setDialogOpen(false);
  };
  const openDialog = () => setDialogOpen(true);

  return (
    <>
      <Typography variant="h3">Skills</Typography>
      <Button variant="outlined" onClick={openDialog}>Add Skill</Button>
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <form onSubmit={handleSubmit(createSkill)}>
          <DialogTitle>New Skill</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Create a new skill
            </DialogContentText>

            <TextField
              label="Name"
              variant="filled"
              value={nameControl.field.value}
              onChange={nameControl.field.onChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button type="submit">{idControl.field.value ? "Update" : "Create"}</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {skills?.map(skill =>
            <TableRow key={skill.id ?? "new"}>
              <TableCell>{skill.id}</TableCell>
              <TableCell>{skill.name}</TableCell>
              <TableCell>
                <IconButton onClick={() => editSkill(skill)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => deleteSkill(skill.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};
