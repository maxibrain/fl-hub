import { CandidateTracker } from './candidateTracker';

export interface CandidateDto {
  profile: CandidateProfile;
  tracker: CandidateTracker;
}

export interface CandidateProfile {
  id: string;
  name: string;
  username: string;
}
