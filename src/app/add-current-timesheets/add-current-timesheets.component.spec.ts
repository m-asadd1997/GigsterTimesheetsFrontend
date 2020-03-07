import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCurrentTimesheetsComponent } from './add-current-timesheets.component';

describe('AddCurrentTimesheetsComponent', () => {
  let component: AddCurrentTimesheetsComponent;
  let fixture: ComponentFixture<AddCurrentTimesheetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCurrentTimesheetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCurrentTimesheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
