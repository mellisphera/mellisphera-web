import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyWeightComponent } from './hourly-weight.component';

describe('HourlyWeightComponent', () => {
  let component: HourlyWeightComponent;
  let fixture: ComponentFixture<HourlyWeightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourlyWeightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourlyWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
