import { SearchCandidatesOptions } from './search-candidates-options';
import { ObjectID } from 'typeorm';

export interface CreateSearchDto {
  name: string;
  userId: string;
  params: SearchCandidatesOptions;
}
