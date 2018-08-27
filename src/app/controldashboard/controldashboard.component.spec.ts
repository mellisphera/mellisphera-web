import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControldashboardComponent } from './controldashboard.component';

describe('ControldashboardComponent', () => {
  let component: ControldashboardComponent;
  let fixture: ComponentFixture<ControldashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControldashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControldashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
