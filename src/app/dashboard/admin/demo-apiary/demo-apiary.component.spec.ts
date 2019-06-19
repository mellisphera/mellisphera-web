import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoApiaryComponent } from './demo-apiary.component';

describe('DemoApiaryComponent', () => {
  let component: DemoApiaryComponent;
  let fixture: ComponentFixture<DemoApiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoApiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoApiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
