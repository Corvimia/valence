export type Character = {
  id: number;
  name: string;
  playerId: number;
}
export type CharacterWithPlayer = Character & {
  player: {
    id: number;
    name: string;
  };
}
