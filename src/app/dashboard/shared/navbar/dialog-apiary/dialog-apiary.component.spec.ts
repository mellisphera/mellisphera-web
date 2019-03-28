import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogApiaryComponent } from './dialog-apiary.component';

describe('DialogApiaryComponent', () => {
  let component: DialogApiaryComponent;
  let fixture: ComponentFixture<DialogApiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogApiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogApiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
