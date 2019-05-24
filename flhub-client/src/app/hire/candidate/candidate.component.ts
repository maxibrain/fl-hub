import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { CandidateDto } from '../interfaces/candidate.dto';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HireState } from '../state/hire.state';
import { GetCandidate, UpdateCandidateStatus, UpdateCandidateProfile } from '../state/hire.actions';
import { CandidateStatus } from '../interfaces/candidateTracker';
import { MatDialog } from '@angular/material';
import { CandidateStatusCommentDialogComponent } from './candidate-status-comment-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss'],
})
export class CandidateComponent implements OnInit {
  readonly candidate$: Observable<CandidateDto>;

  private get searchName(): string {
    return this.route.snapshot.params.name;
  }

  private get profileId(): string {
    return this.route.snapshot.params.id;
  }

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private store: Store, private sanitizer: DomSanitizer) {
    this.candidate$ = route.params.pipe(mergeMap(params => store.select(HireState.candidate(params.name, params.id))));
  }

  ngOnInit() {
    const { name, id } = this.route.snapshot.params;
    this.store.dispatch(new GetCandidate(name, id));
  }

  getLink(candidate: CandidateDto) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(candidate.profile.link);
  }

  update() {
    const { id } = this.route.snapshot.params;
    this.store.dispatch(new UpdateCandidateProfile(id));
  }

  good(candidate: CandidateDto) {
    this.store.dispatch(
      new UpdateCandidateStatus({
        searchName: this.searchName,
        id: candidate.profile.id,
        status: CandidateStatus.GOOD,
      }),
    );
  }

  watch(candidate: CandidateDto) {
    this.promptComment().subscribe(comment =>
      this.store.dispatch(
        new UpdateCandidateStatus({
          searchName: this.searchName,
          id: candidate.profile.id,
          status: CandidateStatus.WATCH,
          comment,
        }),
      ),
    );
  }

  bad(candidate: CandidateDto) {
    this.promptComment().subscribe(comment =>
      this.store.dispatch(
        new UpdateCandidateStatus({
          searchName: this.searchName,
          id: candidate.profile.id,
          status: CandidateStatus.BAD,
          comment,
        }),
      ),
    );
  }

  private promptComment(): Observable<string> {
    const dialogRef = this.dialog.open(CandidateStatusCommentDialogComponent, {
      width: '250px',
    });

    return dialogRef.afterClosed();
  }
}
