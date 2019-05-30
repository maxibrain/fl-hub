import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { CandidateDto } from '../interfaces/candidate.dto';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HireState } from '../state/hire.state';
import { GetCandidate, UpdateCandidateStatus, UpdateCandidateProfile } from '../state/hire.actions';
import { CandidateStatus } from '../interfaces/candidateTracker';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CandidateStatusCommentDialogComponent } from './candidate-status-comment-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss'],
})
export class CandidateComponent implements OnInit, OnDestroy {
  private readonly _loading$ = new BehaviorSubject(false);
  readonly loading$ = this._loading$.asObservable();
  readonly candidate$: Observable<CandidateDto>;

  private get searchName(): string {
    return this.route.snapshot.params.name;
  }

  private get profileId(): string {
    return this.route.snapshot.params.id;
  }

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private route: ActivatedRoute, private store: Store) {
    this.candidate$ = route.params.pipe(mergeMap(params => store.select(HireState.candidate(params.name, params.id))));
  }

  ngOnInit() {
    const { name, id } = this.route.snapshot.params;
    this._loading$.next(true);
    this.store.dispatch(new GetCandidate(name, id)).subscribe(() => this._loading$.next(false));
  }

  ngOnDestroy() {
    this._loading$.complete();
  }

  update() {
    const { id } = this.route.snapshot.params;
    this._loading$.next(true);
    this.store.dispatch(new UpdateCandidateProfile(id)).subscribe(() => this._loading$.next(false));
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

  copyUsername(candidate: CandidateDto) {
    if (candidate.profile.username) {
      copyToClipboard(candidate.profile.username);
      this.snackBar.open('Username copied to clipboard');
    } else {
      this.snackBar.open('No username parsed');
    }
  }

  invited(candidate: CandidateDto) {
    this.store.dispatch(
      new UpdateCandidateStatus({
        searchName: this.searchName,
        id: candidate.profile.id,
        status: CandidateStatus.INVITED,
      }),
    );
  }

  hired(candidate: CandidateDto) {
    this.store.dispatch(
      new UpdateCandidateStatus({
        searchName: this.searchName,
        id: candidate.profile.id,
        status: CandidateStatus.HIRED,
      }),
    );
  }

  refused(candidate: CandidateDto) {
    this.promptComment().subscribe(comment =>
      this.store.dispatch(
        new UpdateCandidateStatus({
          searchName: this.searchName,
          id: candidate.profile.id,
          status: CandidateStatus.REFUSED,
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
