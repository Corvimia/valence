import { useParams } from 'react-router-dom';
import { useController, useFieldArray, useForm } from 'react-hook-form';
import { api, fetcher } from '../../api';
import useSWR from 'swr';
import { Button, TextField } from '@mui/material';
import { useEffect } from 'react';
import { CharacterCreateDto, CharacterWithIncludes } from './model';
import { Skill, SkillType } from '../skill/model';

export interface CharacterEditPageProps {}

export const CharacterEditPage: React.VFC<CharacterEditPageProps> = (props) => {
  const { id } = useParams();

  const { data: character = {} as CharacterWithIncludes, mutate } =
    useSWR<CharacterWithIncludes>(
      `/api/characters/${id}?includes=true`,
      fetcher
    );

  const { data: skills = [] } = useSWR<Skill[]>(`/api/skills`, fetcher);

  useEffect(() => {
    setValue('id', character?.id);
    setValue('name', character?.name);
    setValue('playerId', character?.playerId);
    setValue(
      'skills',
      character.characterSkills?.map((cs) => ({
        id: cs.skill.id,
        level: cs.level,
      }))
    );
  }, [character]);

  const { handleSubmit, control, setValue, register } = useForm({
    defaultValues: {
      id: 0,
      name: '',
      playerId: 0,
    },
  });

  const nameControl = useController({
    name: 'name',
    control: control,
    rules: { required: true },
  });

  const skillControl = useFieldArray({
    name: 'skills',
    control,
    rules: { required: true },
  });

  const updateCharacter = async (newCharacter: CharacterCreateDto) => {
    console.log({ newCharacter });
    await mutate(
      async () => {
        const { data } = await api.put<CharacterWithIncludes>(
          `/api/characters/${newCharacter.id}?includes=true`,
          newCharacter
        );

        return data;
      },
      {
        rollbackOnError: true,
        populateCache: (newItem) => {
          return newItem;
        },
        revalidate: true,
      }
    );
  };

  return (
    <div>
      <h1>Edit {nameControl.field.value}</h1>
      <form onSubmit={handleSubmit(updateCharacter)}>
        <div>
          <p>Player: {character?.player?.name}</p>

          <TextField
            label="Name"
            variant="filled"
            value={nameControl.field.value}
            onChange={nameControl.field.onChange}
          />
        </div>
        <hr />

        <h3>Attributes</h3>
        <p>In Progress...</p>
        <hr />

        <h3>Skills</h3>
        {skills
          .filter((skill) => skill.type === SkillType.basic)
          .map((skill, index) => (
            <div key={skill.id}>
              <TextField
                label={skill.name}
                variant="filled"
                type="number"
                {...register(`skills.[${index}].level`)}
              />
              <input
                type="hidden"
                value={skill.id}
                {...register(`skills.[${index}].id`)}
              />
            </div>
          ))}
        <hr />
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
};
