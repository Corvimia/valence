import { useNavigate } from "react-router-dom";
import { useController, useForm } from "react-hook-form";
import { api, fetcher } from "../../api";
import useSWR, {} from "swr";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import { Player, PlayerWithCharacters } from "../player/model";
import { Character } from "./model";
import PlayerCreateDialog from "../player/player-create-dialog";
import React from "react";

export interface CharacterEditPageProps {
}

export const CharacterCreatePage: React.VFC<CharacterEditPageProps> = (props) => {

  const { data: players = [], mutate: mutatePlayers } = useSWR<Player[]>("/api/players", fetcher);

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      id: 0,
      name: "",
      playerId: 0
    }
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

  const navigate = useNavigate();

  const createCharacter = async (newCharacter: Character) => {
    const { data } = await api.post<Character>("/api/characters", newCharacter);
    navigate(`../${data.id}`);
  };

  const onPlayerCreated = async (data: PlayerWithCharacters) => {
    await mutatePlayers(() => [data], {
      optimisticData: [...players],
      rollbackOnError: true,
      populateCache: newItem => {
        return [...players, ...newItem];
      },
      revalidate: true
    });
    setValue("playerId", data.id);
  }


  return (
    <div>
      <h1>Character Create Page</h1>
      <form onSubmit={handleSubmit(createCharacter)}>
        <div>
          <p>
            Create a new character
          </p>

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
          or
          <PlayerCreateDialog onPlayerChanged={onPlayerCreated}/>
        </div>
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
};
