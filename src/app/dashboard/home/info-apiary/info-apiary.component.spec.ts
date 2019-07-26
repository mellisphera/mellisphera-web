import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoApiaryComponent } from './info-apiary.component';

describe('InfoApiaryComponent', () => {
  let component: InfoApiaryComponent;
  let fixture: ComponentFixture<InfoApiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoApiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoApiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
