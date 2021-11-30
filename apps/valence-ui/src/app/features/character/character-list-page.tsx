import React, { useState } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import useSWR from "swr";
import { api, fetcher } from "../../api";
import Player from "../player/model";
import Character from "./model";

export interface CharacterPageProps {
}

export const CharacterListPage: React.VFC<CharacterPageProps> = () => {

  const { handleSubmit, reset, control, setValue } = useForm({
    defaultValues: {
      id: 0,
      name: "",
      playerId: 0
    }
  });

  const idControl = useController({
    name: "id",
    control: control
  });

  const nameControl = useController({
    name: "name",
    control: control,
    rules: { required: true }
  });

  const playerControl = useController({
    name: "playerId",
    control: control,
    rules: { required: true }
  });


  const { data: characters = [], mutate } = useSWR<Character[]>("/api/characters", fetcher);
  const { data: players = [] } = useSWR<Player[]>("/api/players", fetcher);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const updateCharacter = async (character: Character) => {
    await mutate(async () => {
      const { data } = await api.put<Character>(`/api/characters/${character.id}`, character);

      closeDialog();

      return [data];
    }, {
      optimisticData: [...characters],
      rollbackOnError: true,
      populateCache: newItem => {
        return [...characters];
      },
      revalidate: true
    });
  };

  const createCharacter = async (character: Character) => {
    if (character.id) {
      return updateCharacter(character);
    }
    await mutate(async () => {
      const { data } = await api.post<Character>("/api/characters", character);

      closeDialog();

      return [data];
    }, {
      optimisticData: [...characters, character],
      rollbackOnError: true,
      populateCache: newItem => {
        return [...characters, ...newItem];
      },
      revalidate: true
    });
  };

  const deleteCharacter = async (characterId: number) => {
    await mutate(async () => {
      await api.delete<Player>(`/api/characters/${characterId}`);
      return [];
    }, {
      optimisticData: [...characters],
      rollbackOnError: true,
      populateCache: () => {
        return [...characters];
      },
      revalidate: true
    });
  };

  const editCharacter = (character: Character) => {
    setValue("id", character.id);
    setValue("name", character.name);
    setValue("playerId", character.playerId);
    openDialog();
  };

  const closeDialog = () => {
    reset();
    setDialogOpen(false);
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
            <br />
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
            <Button type="submit">{idControl.field.value ? "Update" : "Create"}</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Player</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {characters?.map(character =>
            <TableRow key={character.id}>
              <TableCell>{character.id}</TableCell>
              <TableCell>{character.name}</TableCell>
              <TableCell>{character.player?.name ?? ""}</TableCell>
              <TableCell>
                <IconButton onClick={() => editCharacter(character)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => deleteCharacter(character.id)}>
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
