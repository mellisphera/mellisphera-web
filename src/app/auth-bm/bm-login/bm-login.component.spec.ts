import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BmLoginComponent } from './bm-login.component';

describe('BmLoginComponent', () => {
  let component: BmLoginComponent;
  let fixture: ComponentFixture<BmLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BmLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BmLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
