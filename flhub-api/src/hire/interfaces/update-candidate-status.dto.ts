import { CandidateStatus } from './candidateTracker';

export interface UpdateCandidateStatusDto {
  id: string;
  searchName: string;
  status: CandidateStatus;
  comment?: string;
}
