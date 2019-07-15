import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesHivesComponent } from './notes-hives.component';

describe('NotesHivesComponent', () => {
  let component: NotesHivesComponent;
  let fixture: ComponentFixture<NotesHivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesHivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesHivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
