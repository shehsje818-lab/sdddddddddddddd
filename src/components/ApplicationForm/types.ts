export type PositionType = 'junior-helper' | 'slayer-carrier' | 'dungeon-carrier';

export interface JuniorHelperForm {
  age: number;
  discordUserId: string;
  hasWorkingMicrophone: 'yes' | 'no';
  aboutYourself: string;
  whyHireYou: string;
  whyStaffMember: string;
  rulesKnowledge: string;
  inGameInfo: string;
  previousExperience: string;
  additionalInfo?: string;
}

export interface SlayerCarrierForm {
  discordUserId: string;
  inGameName: string;
  networth: string;
  totalPlaytime: string;
  combatLevel: number;
  slayerBosses: string;
  weeklyAvailability: string;
  involvedWithGiveawayServers: 'no' | 'yes-not-eligible';
  additionalInfo?: string;
}

export interface DungeonCarrierForm {
  discordUserId: string;
  inGameName: string;
  networth: string;
  totalPlaytime: string;
  catacombsLevel: number;
  dungeonClasses: string;
  classLevels: string;
  floorsCanCarry: string;
  availability: string;
  involvedWithGiveawayServers: 'no' | 'yes-not-eligible';
  additionalInfo?: string;
}
