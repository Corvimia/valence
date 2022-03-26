import { useParams } from "react-router-dom";
import { useController, useForm } from "react-hook-form";
import { api, fetcher } from "../../api";
import Player from "../player/model";
import useSWR, {} from "swr";
import Character from "./model";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import { useEffect } from "react";

export interface CharacterEditPageProps {
}

export const CharacterEditPage: React.VFC<CharacterEditPageProps> = (props) => {
  const { id } = useParams();

  const { data: players = [] } = useSWR<Player[]>("/api/players", fetcher);

  const { data: character = {} as Character, mutate } = useSWR<Character>(`/api/characters/${id}`, fetcher);

  useEffect(() => {
    setValue("id", character?.id);
    setValue("name", character?.name);
    setValue("playerId", character?.playerId);
  }, [character]);

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

  const updateCharacter = async (newCharacter: Character) => {
    await mutate(async () => {
      const { data } = await api.put<Character>(`/api/characters/${newCharacter.id}`, newCharacter);

      return data;
    }, {
      optimisticData: newCharacter,
      rollbackOnError: true,
      populateCache: newItem => {
        return newCharacter;
      },
      revalidate: true
    });
  };

  return (
    <div>
      <h1>Character Edit Page</h1>
      <form onSubmit={handleSubmit(updateCharacter)}>
        <div>
          <p>
            Edit Character
          </p>

          <p>
            Player: {character?.player?.name}
          </p>

          <TextField
            label="Name"
            variant="filled"
            value={nameControl.field.value}
            onChange={nameControl.field.onChange}
          />
        </div>
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
};