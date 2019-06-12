import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorsManagerComponent } from './sensors-manager.component';

describe('SensorsManagerComponent', () => {
  let component: SensorsManagerComponent;
  let fixture: ComponentFixture<SensorsManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorsManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
