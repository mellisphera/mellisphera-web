import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorsHiveComponent } from './sensors-hive.component';

describe('SensorsHiveComponent', () => {
  let component: SensorsHiveComponent;
  let fixture: ComponentFixture<SensorsHiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorsHiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorsHiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
