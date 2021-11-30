import Player from "../player/model";

export default interface Character {
  id: number;
  name: string;
  playerId: number;
  player?: Player;
}
