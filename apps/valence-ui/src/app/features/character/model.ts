export type Character = {
  id: number;
  name: string;
  playerId: number;
}
type PlayerInclude = {
  player: {
    id: number;
    name: string;
  }
}
type SkillInclude = {
  characterSkills: {
    level: number;
    skill: {
      id: number;
      name: string;
    }
  }[]
}
export type CharacterWithPlayer = Character & PlayerInclude;

export type CharacterWithIncludes = Character & PlayerInclude & SkillInclude;
