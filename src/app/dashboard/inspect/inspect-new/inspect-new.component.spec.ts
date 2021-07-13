import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectNewComponent } from './inspect-new.component';

describe('InspectNewComponent', () => {
  let component: InspectNewComponent;
  let fixture: ComponentFixture<InspectNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
