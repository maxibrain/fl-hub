import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateListItemComponent } from './candidate-list-item.component';

describe('CandidateListItemComponent', () => {
  let component: CandidateListItemComponent;
  let fixture: ComponentFixture<CandidateListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
