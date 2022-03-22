import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton, MenuItem, Select,
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
import { Player } from "../PlayerPage";

const send = (_: string, _2: string) => Promise.resolve({} as any);

function useSql<S>(_: string, deps?: React.DependencyList | undefined): { data: S } {
  const [data, setData] = useState<S>(null as any);
  return { data };
}

interface Character {
  id: number;
  name: string;
  playerId: number;
}

export interface CharacterPageProps {
}

export const CharacterPage: React.VFC<CharacterPageProps> = () => {

  const { handleSubmit, reset, control, setValue } = useForm({
    defaultValues: {
      id: 0,
      name: "",
      playerId: 0,
    },
  });

  const idControl = useController({
    name: "id",
    control: control,
  });

  const nameControl = useController({
    name: "name",
    control: control,
    rules: { required: true }
  });

  const playerControl = useController({
    name: "playerId",
    control: control,
    rules: { required: true },
  });

  const [render, setRender] = useState<number>(0);

  const update = () => setRender(r => r + 1);

  const { data: characters } = useSql<Character[]>("", [render]);

  const { data: players } = useSql<Player[]>("", [render]);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const createCharacter = (character: Character) => {

    let sql = '';
    if(character.id){
      sql = ``;
    } else {
      sql = ``;
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

  const deleteCharacter = (characterId: number) => {
    send("sql", ``).then(({ error }) => {
      if (error) {
        alert(error);
      } else {
        update();
      }
    })
  }

  const editCharacter = (character: Character) => {
    setValue("id", character.id);
    setValue("name", character.name);
    setValue("playerId", character.playerId);
    openDialog();
  }

  const closeDialog = () => {
    reset();
    setDialogOpen(false)
  };
  const openDialog = () => setDialogOpen(true);

  return (
    <>
      <Typography variant="h3">Characters</Typography>
      <Button variant="outlined" onClick={openDialog}>Add Character</Button>
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <form onSubmit={handleSubmit(createCharacter)}>
          <DialogTitle>New Character</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Create a new character
            </DialogContentText>

            <TextField
              label="Name"
              variant="filled"
              value={nameControl.field.value}
              onChange={nameControl.field.onChange}
            />
            <br/>
            <Select
              value={playerControl.field.value}
              label="Player"
              onChange={playerControl.field.onChange}>
              <MenuItem value={0}>None</MenuItem>
              {players?.map(player => <MenuItem key={player.id} value={player.id}>{player.name}</MenuItem>)}
            </Select>
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
            <TableCell>Player ID</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {characters?.map(character =>
            <TableRow key={character.id}>
              <TableCell>{character.id}</TableCell>
              <TableCell>{character.name}</TableCell>
              <TableCell>{character.playerId}</TableCell>
              <TableCell>
                <IconButton onClick={() => editCharacter(character)}>
                  <EditIcon/>
                </IconButton>
                <IconButton onClick={() => deleteCharacter(character.id)}>
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
