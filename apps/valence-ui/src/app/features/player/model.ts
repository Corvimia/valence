import Character from "../character/model";

export default interface Player {
  id: number;
  name: string;
  characters?: Character[];
}
