import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalStatusComponent } from './global-status.component';

describe('GlobalStatusComponent', () => {
  let component: GlobalStatusComponent;
  let fixture: ComponentFixture<GlobalStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
