import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsViewTemplateComponent } from './settings-view-template.component';

describe('SettingsViewTemplateComponent', () => {
  let component: SettingsViewTemplateComponent;
  let fixture: ComponentFixture<SettingsViewTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsViewTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsViewTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
