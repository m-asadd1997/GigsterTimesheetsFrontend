import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCurrentTimesheetsComponent } from './view-current-timesheets.component';

describe('ViewCurrentTimesheetsComponent', () => {
  let component: ViewCurrentTimesheetsComponent;
  let fixture: ComponentFixture<ViewCurrentTimesheetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCurrentTimesheetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCurrentTimesheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
