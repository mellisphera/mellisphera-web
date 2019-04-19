import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceConfigComponent } from './preference-config.component';

describe('PreferenceConfigComponent', () => {
  let component: PreferenceConfigComponent;
  let fixture: ComponentFixture<PreferenceConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenceConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
