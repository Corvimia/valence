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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import useSWR from "swr";
import { api, fetcher } from "../../api";
import { Link } from "react-router-dom";
import { Character, CharacterWithPlayer } from "./model";
import { Player } from "../player/model";

export interface CharacterPageProps {
}

export const CharacterListPage: React.VFC<CharacterPageProps> = () => {

  const { data: characters = [], mutate } = useSWR<CharacterWithPlayer[]>("/api/characters", fetcher);

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

  return (
    <>
      <Typography variant="h3">Characters</Typography>
      <Link to="new">Add Character</Link>
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
                <Link to={`${character.id}`}>
                  <IconButton>
                    <EditIcon/>
                  </IconButton>
                </Link>
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
