import { CandidateProfile } from './candidateProfile';
import { CandidateTracker } from './candidateTracker';

export interface CandidateDto {
  profile: CandidateProfile;
  tracker: CandidateTracker;
  history: CandidateHistory;
}
