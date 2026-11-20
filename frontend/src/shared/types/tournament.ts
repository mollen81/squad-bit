export type TournamentStatus = 'LIVE' | 'REGISTRATION' | 'UPCOMING';
export type MatchFormat = 'BO1' | 'BO3' | 'BO5';
export type GameMode = 'RAAS' | 'INVASION' | 'AAS' | 'SKIRMISH';
export type EventCategory = 'SCRIM' | 'PICKUP';

export interface SquadMapInfo {
  mapId: string;
  name: string;
  previewUrl: string;
}

export interface MapVoteOption extends SquadMapInfo {
  votes: number;
}

export interface TournamentItem {
  id: string;
  title: string;
  category: EventCategory;
  format: MatchFormat;
  status: TournamentStatus;
  gameMode: GameMode;
  creatorNickname: string;
  creatorAvatarUrl?: string | null;
  joinedPlayers: number;
  maxPlayers: number;
  currentMap: SquadMapInfo;
  currentMapNumber?: number;
  mapPool?: MapVoteOption[];
}
