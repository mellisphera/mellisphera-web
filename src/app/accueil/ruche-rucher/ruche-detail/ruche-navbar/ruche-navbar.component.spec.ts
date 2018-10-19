import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RucheNavbarComponent } from './ruche-navbar.component';

describe('RucheNavbarComponent', () => {
  let component: RucheNavbarComponent;
  let fixture: ComponentFixture<RucheNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RucheNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RucheNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
