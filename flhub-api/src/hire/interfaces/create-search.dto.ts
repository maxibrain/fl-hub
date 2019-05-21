import { SearchCandidatesOptions } from './search-candidates-options';

export interface CreateSearchDto {
  name: string;
  params: SearchCandidatesOptions;
}
