import { Entity, Column, Index, ObjectIdColumn, ObjectID } from 'typeorm';
import { CandidateStatus } from '../interfaces';

@Entity()
export class CandidateStatusPatch {
  @ObjectIdColumn() id: ObjectID;
  @Column() @Index() searchQueryId: string;
  @Column() @Index() profileId: string;
  @Column() @Index() status: string;
  @Column({ nullable: true }) reviewComment?: string;
}

export function createCandidateStatusPatch(searchQueryId: string, profileId: string, status: CandidateStatus, comment?: string) {
  const patch = new CandidateStatusPatch();
  patch.searchQueryId = searchQueryId;
  patch.profileId = profileId;
  patch.status = status;
  patch.reviewComment = comment;
  return patch;
}

export function createInitialCandidateStatusPatch(searchQueryId: string, profileId: string) {
  return createCandidateStatusPatch(searchQueryId, profileId, CandidateStatus.INITIAL);
}
