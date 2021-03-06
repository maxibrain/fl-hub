import { SearchCandidatesOptions } from './search-candidates-options';
import { CandidateDto } from './candidate.dto';

export interface SearchQuery {
  name: string;
  params: SearchCandidatesOptions;
  candidates: CandidateDto[];
}
