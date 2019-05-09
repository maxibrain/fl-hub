import { Candidate } from './candidate';
import { CandidateTracker } from './candidateTracker';

export interface CandidateDto {
  profile: Candidate;
  tracker: CandidateTracker;
}
