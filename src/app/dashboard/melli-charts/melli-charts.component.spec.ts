import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MelliChartsComponent } from './melli-charts.component';

describe('MelliChartsComponent', () => {
  let component: MelliChartsComponent;
  let fixture: ComponentFixture<MelliChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MelliChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MelliChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
