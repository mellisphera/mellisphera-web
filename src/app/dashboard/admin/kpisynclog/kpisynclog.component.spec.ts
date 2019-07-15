import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpisynclogComponent } from './kpisynclog.component';

describe('KpisynclogComponent', () => {
  let component: KpisynclogComponent;
  let fixture: ComponentFixture<KpisynclogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpisynclogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpisynclogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
