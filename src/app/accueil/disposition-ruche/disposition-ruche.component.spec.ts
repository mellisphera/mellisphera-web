import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispositionRucheComponent } from './disposition-ruche.component';

describe('DispositionRucheComponent', () => {
  let component: DispositionRucheComponent;
  let fixture: ComponentFixture<DispositionRucheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispositionRucheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispositionRucheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
