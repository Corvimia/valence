export enum SkillType {
  basic = 'basic',
  advanced = 'advanced',
}

export type Skill = {
  id: number;
  name: string;
  type: SkillType;
};
