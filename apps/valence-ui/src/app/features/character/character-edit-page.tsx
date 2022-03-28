import { useParams } from "react-router-dom";
import { useController, useForm } from "react-hook-form";
import { api, fetcher } from "../../api";
import useSWR, {} from "swr";
import { Button, Grid, MenuItem, Select, TextField } from "@mui/material";
import { useEffect } from "react";
import { Character, CharacterWithIncludes, CharacterWithPlayer } from "./model";
import { Skill } from "../skill/model";

export interface CharacterEditPageProps {
}

export const CharacterEditPage: React.VFC<CharacterEditPageProps> = (props) => {
  const { id } = useParams();

  const {
    data: character = {} as CharacterWithIncludes,
    mutate
  } = useSWR<CharacterWithIncludes>(`/api/characters/${id}?includes=true`, fetcher);

  const { data: skills = [] } = useSWR<Skill[]>(`/api/skills`, fetcher);

  useEffect(() => {
    setValue("id", character?.id);
    setValue("name", character?.name);
    setValue("playerId", character?.playerId);
  }, [character]);

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

  const updateCharacter = async (newCharacter: Character) => {
    await mutate(async () => {
      const { data } = await api.put<CharacterWithIncludes>(`/api/characters/${newCharacter.id}?includes=true`, newCharacter);

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
        <hr/>

        <h3>Skills</h3>
        {
          character.characterSkills?.map(({ level, skill }) => (
            <div key={skill.id}>
              <TextField
                label={skill.name}
                variant="filled"
                type="number"
                value={level}
              />
            </div>
          ))
        }
        <hr/>
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
};
