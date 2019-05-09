export enum CandidateStatus {
  INITIAL = 'INITIAL',
  WATCH = 'WATCH',
  GOOD = 'GOOD',
  BAD = 'BAD',
  INVITED = 'INVITED',
  HIRED = 'HIRED',
  REFUSED = 'REFUSED',
}

export interface CandidateTracker {
  profileId: string;
  status: CandidateStatus | string;
  reviewDate: Date;
  reviewComment?: string;
}
