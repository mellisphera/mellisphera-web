import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthHiveComponent } from './health-hive.component';

describe('HealthHiveComponent', () => {
  let component: HealthHiveComponent;
  let fixture: ComponentFixture<HealthHiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthHiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthHiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
