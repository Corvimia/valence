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
import { Player, PlayerWithCharacters } from "./model";

export interface PlayerPageProps {
}

export const PlayerListPage: React.VFC<PlayerPageProps> = () => {

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

  const { data: players = [], mutate } = useSWR<PlayerWithCharacters[]>("/api/players", fetcher);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const updatePlayer = async (player: Player) => {
    await mutate(async () => {
      const { data } = await api.put<PlayerWithCharacters>(`/api/players/${player.id}`, player);

      closeDialog();

      return [data];
    }, {
      optimisticData: [...players],
      rollbackOnError: true,
      populateCache: newItem => {
        return [...players];
      },
      revalidate: true
    });
  };

  const createPlayer = async (player: Player) => {
    if (player.id) {
      return updatePlayer(player);
    }
    await mutate(async () => {
      const { data } = await api.post<PlayerWithCharacters>("/api/players", player);

      closeDialog();

      return [data];
    }, {
      rollbackOnError: true,
      populateCache: newItem => {
        return [...players, ...newItem];
      },
      revalidate: true
    });
  };

  const deletePlayer = async (playerId: number) => {
    await mutate(async () => {
      await api.delete<Player>(`/api/players/${playerId}`);
      return [];
    }, {
      optimisticData: [...players],
      rollbackOnError: true,
      populateCache: () => {
        return [...players];
      },
      revalidate: true
    });
  };

  const editPlayer = (player: Player) => {
    setValue("id", player.id);
    setValue("name", player.name);
    openDialog();
  };

  const closeDialog = () => {
    reset();
    setDialogOpen(false);
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
            <Button type="submit">{idControl.field.value ? "Update" : "Create"}</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Characters</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players?.map(player =>
            <TableRow key={player.id ?? "new"}>
              <TableCell>{player.id}</TableCell>
              <TableCell>{player.name}</TableCell>
              <TableCell>{player.characters?.map(c => c.name).join(",")}</TableCell>
              <TableCell>
                <IconButton onClick={() => editPlayer(player)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => deletePlayer(player.id)}>
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
