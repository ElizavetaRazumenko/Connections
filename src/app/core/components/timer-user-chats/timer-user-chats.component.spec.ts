import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerUserChatsComponent } from './timer-user-chats.component';

describe('TimerUserChatsComponent', () => {
  let component: TimerUserChatsComponent;
  let fixture: ComponentFixture<TimerUserChatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimerUserChatsComponent]
    });
    fixture = TestBed.createComponent(TimerUserChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
