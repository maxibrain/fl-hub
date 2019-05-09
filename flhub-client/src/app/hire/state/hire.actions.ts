import { SearchCandidatesOptions } from '../interfaces/search-candidates-options';

export class GetCandidates {
  static readonly type = '[Hire] Get Candidates';
}

export class FetchCandidates {
  static readonly type = '[Hire] Fetch Candidates';
}

export class CreateSearchQuery {
  static readonly type = '[Hire] Create Search Query';

  constructor(public readonly data: SearchCandidatesOptions) {}
}
