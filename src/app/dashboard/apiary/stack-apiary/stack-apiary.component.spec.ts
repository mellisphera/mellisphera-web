import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackApiaryComponent } from './stack-apiary.component';

describe('StackApiaryComponent', () => {
  let component: StackApiaryComponent;
  let fixture: ComponentFixture<StackApiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackApiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackApiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
