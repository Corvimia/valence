import React, {} from "react";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useSWR, {} from "swr";
import { api, fetcher } from "../../api";
import { Player, PlayerWithCharacters } from "./model";
import PlayerCreateDialog from "./player-create-dialog";

export interface PlayerPageProps {
}

export const PlayerListPage: React.VFC<PlayerPageProps> = () => {

  const { data: players = [], mutate } = useSWR<PlayerWithCharacters[]>("/api/players", fetcher);


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

  const onPlayerCreated = async (data: PlayerWithCharacters) => {
    await mutate(() => [data], {
      optimisticData: [...players],
      rollbackOnError: true,
      populateCache: newItem => {
        return [...players, ...newItem];
      },
      revalidate: true
    })
  }


  return (
    <>
      <Typography variant="h3">Players</Typography>
      <PlayerCreateDialog onPlayerChanged={onPlayerCreated}/>
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
