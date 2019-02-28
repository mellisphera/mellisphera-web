import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Erreur404ComponentComponent } from './erreur404-component.component';

describe('Erreur404ComponentComponent', () => {
  let component: Erreur404ComponentComponent;
  let fixture: ComponentFixture<Erreur404ComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Erreur404ComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Erreur404ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
