import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalityComponent } from './vitality.component';

describe('VitalityComponent', () => {
  let component: VitalityComponent;
  let fixture: ComponentFixture<VitalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
