import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerGroupChatsComponent } from './timer-group-chats.component';

describe('TimerGroupChatsComponent', () => {
  let component: TimerGroupChatsComponent;
  let fixture: ComponentFixture<TimerGroupChatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimerGroupChatsComponent]
    });
    fixture = TestBed.createComponent(TimerGroupChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
