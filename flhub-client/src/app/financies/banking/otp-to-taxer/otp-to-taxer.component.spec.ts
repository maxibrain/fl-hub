import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpToTaxerComponent } from './otp-to-taxer.component';

describe('OtpToTaxerComponent', () => {
  let component: OtpToTaxerComponent;
  let fixture: ComponentFixture<OtpToTaxerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpToTaxerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpToTaxerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
