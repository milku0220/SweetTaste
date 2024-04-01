import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Checkout3Component } from './checkout3.component';

describe('Checkout3Component', () => {
  let component: Checkout3Component;
  let fixture: ComponentFixture<Checkout3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Checkout3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Checkout3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
