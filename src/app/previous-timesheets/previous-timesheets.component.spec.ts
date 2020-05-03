import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousTimesheetsComponent } from './previous-timesheets.component';

describe('PreviousTimesheetsComponent', () => {
  let component: PreviousTimesheetsComponent;
  let fixture: ComponentFixture<PreviousTimesheetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousTimesheetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousTimesheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
