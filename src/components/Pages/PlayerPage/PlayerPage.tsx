import React, { useState } from 'react';
import { send, useSql } from "../../../message-control/renderer";
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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


interface Player {
  id: number;
  name: string;
}

export interface PlayerPageProps {
}

export const PlayerPage: React.VFC<PlayerPageProps> = () => {

  const { handleSubmit, reset, control, setValue } = useForm({
    defaultValues: {
      id: 0,
      name: "",
    },
  });

  const nameControl = useController({
    name: "name",
    control: control,
    rules: { required: true }
  });

  const idControl = useController({
    name: "id",
    control: control,
  })

  const [render, setRender] = useState<number>(0);
  const update = () => setRender(r => r + 1);

  const { data: players } = useSql<Player[]>("SELECT * FROM Player", [render]);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const createPlayer = (player: Player) => {

    let sql = '';
    if(player.id){
      sql = `UPDATE Player SET name = '${player.name}' WHERE id = ${player.id}`;
    } else {
      sql = `INSERT INTO Player (name) VALUES ('${player.name}')`;
    }

    send("sql", sql).then(({ error }) => {
      if (error) {
        alert(error);
      } else {
        closeDialog();
        update();
      }
    })
  }

  const deletePlayer = (playerId: number) => {
    send("sql", `DELETE FROM Player WHERE id = ${playerId}`).then(({ error }) => {
      if (error) {
        alert(error);
      } else {
        update();
      }
    })
  }

  const editPlayer = (player: Player) => {
    setValue("id", player.id);
    setValue("name", player.name);
    openDialog();
  }

  const closeDialog = () => {
    reset();
    setDialogOpen(false)
  };
  const openDialog = () => setDialogOpen(true);

  return (
    <>
      <Typography variant="h3">Players</Typography>
      <Button variant="outlined" onClick={openDialog}>Add Player</Button>
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <form onSubmit={handleSubmit(createPlayer)}>
          <DialogTitle>New Player</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Create a new player
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
            <Button type="submit">{idControl.field.value ? 'Update' : 'Create'}</Button>
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
          {players?.map(player =>
            <TableRow key={player.id}>
              <TableCell>{player.id}</TableCell>
              <TableCell>{player.name}</TableCell>
              <TableCell>
                <IconButton onClick={() => editPlayer(player)}>
                  <EditIcon/>
                </IconButton>
                <IconButton onClick={() => deletePlayer(player.id)}>
                  <DeleteIcon/>
                </IconButton>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};
