import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightHivesComponent } from './weight-hives.component';

describe('WeightHivesComponent', () => {
  let component: WeightHivesComponent;
  let fixture: ComponentFixture<WeightHivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightHivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightHivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
