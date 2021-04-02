import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectHistoryComponent } from './inspect-history.component';

describe('InspectHistoryComponent', () => {
  let component: InspectHistoryComponent;
  let fixture: ComponentFixture<InspectHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
