import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { CandidateDto } from '../interfaces/candidate.dto';

@Component({
  selector: 'app-candidate-list-item',
  templateUrl: './candidate-list-item.component.html',
  styleUrls: ['./candidate-list-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateListItemComponent implements OnInit {

  @Input() candidate: CandidateDto;

  get profile() {
    return this.candidate.profile;
  }

  get tracker() {
    return this.candidate.tracker;
  }

  constructor() { }

  ngOnInit() {
  }

}
