import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsConfSubmitComponent } from './alerts-conf-submit.component';

describe('AlertsConfSubmitComponent', () => {
  let component: AlertsConfSubmitComponent;
  let fixture: ComponentFixture<AlertsConfSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertsConfSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsConfSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
