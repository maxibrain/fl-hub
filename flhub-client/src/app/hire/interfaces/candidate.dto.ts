import { CandidateTracker } from './candidateTracker';

export interface CandidateDto {
  profile: CandidateProfile;
  tracker: CandidateTracker;
}

export interface CandidateProfile {
  id: string;
  name: string;
  rate: number;
  username: string;
  availability: 'fullTime' | 'partTime' | 'notSure' | null;
  updated: Date;
  portrait_50: string;
  title: string;
  feedback: number;
  description: string;
  skills: string[];
}
