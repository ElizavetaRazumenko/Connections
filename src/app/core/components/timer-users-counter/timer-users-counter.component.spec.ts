import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerUsersCounterComponent } from './timer-users-counter.component';

describe('TimerUsersCounterComponent', () => {
  let component: TimerUsersCounterComponent;
  let fixture: ComponentFixture<TimerUsersCounterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimerUsersCounterComponent]
    });
    fixture = TestBed.createComponent(TimerUsersCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
