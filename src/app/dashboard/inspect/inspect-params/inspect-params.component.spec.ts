import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectParamsComponent } from './inspect-params.component';

describe('InspectParamsComponent', () => {
  let component: InspectParamsComponent;
  let fixture: ComponentFixture<InspectParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectParamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
