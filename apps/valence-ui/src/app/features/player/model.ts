export type Player = {
  id: number,
  name: string,
}
export type PlayerWithCharacters = Player &{
  characters: {
    id: number,
    name: string,
  }[],
}

