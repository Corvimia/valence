export type Rumour = {
  id: number;
  text: string;
  skillId: number;
  threshold: number;
};

export type RumourWithSkill = Rumour & {
  skill: {
    id: number;
    name: string;
  };
};
