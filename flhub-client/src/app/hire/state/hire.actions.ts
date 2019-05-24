import { UpdateCandidateStatusDto } from '../interfaces/update-candidate-status.dto';
import { CreateSearchDto } from '../interfaces/create-search.dto';

export class ListCandidates {
  static readonly type = '[Hire] List Candidates';

  constructor(public readonly searchName: string) {}
}

export class GetCandidate {
  static readonly type = '[Hire] Get Candidate';

  constructor(public readonly searchName: string, public readonly profileId: string) {}
}

export class UpdateCandidateStatus {
  static readonly type = '[Hire] Update Candidate Status';

  constructor(public readonly status: UpdateCandidateStatusDto) {}
}

export class UpdateCandidateProfile {
  static readonly type = '[Hire] Update Candidate Profile';

  constructor(public readonly id: string) {}
}

export class FetchCandidates {
  static readonly type = '[Hire] Fetch Candidates';

  constructor(public readonly searchName: string) {}
}

export class FetchQueries {
  static readonly type = '[Hire] Fetch Search Queries';
}

export class CreateSearchQuery {
  static readonly type = '[Hire] Create Search Query';

  constructor(public readonly data: CreateSearchDto) {}
}
