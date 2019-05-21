import { Component } from '@angular/core';

@Component({
  selector: 'app-candidate-status-dialog',
  template: `
    <h1 mat-dialog-title>Any comment?</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <textarea matInput [(ngModel)]="comment"></textarea>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-raised-button color="primary" [mat-dialog-close]="comment" cdkFocusInitial>Ok</button>
    </div>
  `,
})
export class CandidateStatusCommentDialogComponent {
  comment: string;
}
