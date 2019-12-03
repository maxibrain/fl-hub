import { CandidateStatus } from './candidateTracker';
import { SearchQuery } from '../entities';

export interface UpdateCandidateStatusDto {
  id: string;
  searchName: string;
  searchQuery: SearchQuery;
  status: CandidateStatus;
  comment?: string;
}
