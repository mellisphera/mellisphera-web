import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoHivesComponent } from './info-hives.component';

describe('InfoHivesComponent', () => {
  let component: InfoHivesComponent;
  let fixture: ComponentFixture<InfoHivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoHivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoHivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
