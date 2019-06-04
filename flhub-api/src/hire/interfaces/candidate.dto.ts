import { CandidateProfile } from './candidateProfile';
import { CandidateTracker } from './candidateTracker';
import { CandidateHistory } from './candidateHistory';

export interface CandidateDto {
  profile: CandidateProfile;
  tracker: CandidateTracker;
  history?: CandidateHistory;
}
