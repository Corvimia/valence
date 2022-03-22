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
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "../../../api";
import axios from "axios";

const send = (_: string, _2: string) => Promise.resolve({} as any);

export interface Player {
  id: number;
  name: string;
}

export interface PlayerPageProps {
}

export const PlayerPage: React.VFC<PlayerPageProps> = () => {

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

  const { data: players = [], error, mutate } = useSWR<Player[]>("/api/players", fetcher);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const updatePlayer = async (player: Player) => {
    await mutate(async () => {
      try {
        const { data } = await axios.put<Player>(`/api/players/${player.id}`, player);

        closeDialog();

        return [data];
      } catch (e) {
        alert(e);
      }
      return [];
    }, {
      optimisticData: [...players],
      rollbackOnError: true,
      populateCache: newItem => {
        return [...players];
      },
      revalidate: true
    });
  }

  const createPlayer = async (player: Player) => {
    if(player.id){
      return updatePlayer(player);
    }
    await mutate(async () => {
      try {
        const { data } = await axios.post<Player>("/api/players", player);

        closeDialog();

        return [data];
      } catch (e) {
        alert(e);
      }
      return [];
    }, {
      optimisticData: [...players, player],
      rollbackOnError: true,
      populateCache: newItem => {
        return [...players, ...newItem];
      },
      revalidate: true
    });
  };

  const deletePlayer = async (playerId: number) => {
    await mutate(async () => {
      try {
        await axios.delete<Player>(`/api/players/${playerId}`);
        return [];
      } catch (e) {
        alert(e);
      }
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
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players?.map(player =>
            <TableRow key={player.id ?? "new"}>
              <TableCell>{player.id}</TableCell>
              <TableCell>{player.name}</TableCell>
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
