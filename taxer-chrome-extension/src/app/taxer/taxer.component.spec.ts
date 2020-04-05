import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxerComponent } from './taxer.component';

describe('TaxerComponent', () => {
  let component: TaxerComponent;
  let fixture: ComponentFixture<TaxerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
