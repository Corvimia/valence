import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useController, useForm } from "react-hook-form";
import { Player, PlayerWithCharacters } from "./model";
import { api } from "../../api";
import { useDialog } from "../core/hooks/use-dialog";

export interface PlayerCreateDialogProps {
  onPlayerChanged: (player: PlayerWithCharacters) => Promise<void>;
}


export const PlayerCreateDialog: React.VFC<PlayerCreateDialogProps> = ({ onPlayerChanged }) => {


  const { handleSubmit, reset, control } = useForm({
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

  const [isOpen, openDialog, closeDialog] = useDialog(reset);

  const updatePlayer = async (player: Player) => {
    const { data } = await api.put<PlayerWithCharacters>(`/api/players/${player.id}`, player);

    await onPlayerChanged(data);

    closeDialog();
  };

  const createPlayer = async (player: Player) => {
    if (player.id) {
      return updatePlayer(player);
    }
    const { data } = await api.post<PlayerWithCharacters>("/api/players", player);

    await onPlayerChanged(data);

    closeDialog();
  };


  return (
    <>
      <Button variant="outlined" onClick={openDialog}>Add Player</Button>
      <Dialog open={isOpen} onClose={closeDialog}>
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
    </>
  );
}

export default PlayerCreateDialog;
