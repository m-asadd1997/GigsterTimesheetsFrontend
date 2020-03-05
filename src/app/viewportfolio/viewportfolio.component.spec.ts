import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewportfolioComponent } from './viewportfolio.component';

describe('ViewportfolioComponent', () => {
  let component: ViewportfolioComponent;
  let fixture: ComponentFixture<ViewportfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewportfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
