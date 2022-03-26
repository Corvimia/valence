import { useParams } from "react-router-dom";
import { useController, useForm } from "react-hook-form";
import { api, fetcher } from "../../api";
import useSWR, {} from "swr";
import { Button, Grid, MenuItem, Select, TextField } from "@mui/material";
import { useEffect } from "react";
import { Character, Player } from "@prisma/client";
import { CharacterWithPlayer } from "./model";

const attributes = [
  ["intelligence", "strength", "presence"],
  ["wits", "dexterity", "manipulation"],
  ["resolve", "stamina", "composure"],
]

export interface CharacterEditPageProps {
}

export const CharacterEditPage: React.VFC<CharacterEditPageProps> = (props) => {
  const { id } = useParams();

  const {
    data: character = {} as CharacterWithPlayer,
    mutate
  } = useSWR<CharacterWithPlayer>(`/api/characters/${id}`, fetcher);

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
      const { data } = await api.put<CharacterWithPlayer>(`/api/characters/${newCharacter.id}`, newCharacter);

      return data;
    }, {
      rollbackOnError: true,
      populateCache: newItem => {
        return newItem;
      },
      revalidate: true
    });
  };

  return (
    <div>
      <h1>Edit {nameControl.field.value}</h1>
      <form onSubmit={handleSubmit(updateCharacter)}>
        <div>
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

        {/*<div>*/}
        {/*  <h3>Attributes</h3>*/}
        {/*  <Grid container>*/}
        {/*    <Grid item>*/}
        {/*      {attributes.map(row => (*/}
        {/*        <Grid container key={`${row}`}>*/}
        {/*          {row.map(attribute => (*/}
        {/*            <Grid item xs={4} key={attribute}>*/}
        {/*              <TextField*/}
        {/*                label={attribute}*/}
        {/*                variant="filled"*/}
        {/*                type="number"*/}
        {/*              />*/}
        {/*            </Grid>*/}
        {/*          ))}*/}
        {/*        </Grid>*/}
        {/*      ))}*/}
        {/*    </Grid>*/}
        {/*  </Grid>*/}
        {/*</div>*/}

        <Button type="submit">Save</Button>
      </form>
    </div>
  );
};
