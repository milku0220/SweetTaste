import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Checkout2Component } from './checkout2.component';

describe('Checkout2Component', () => {
  let component: Checkout2Component;
  let fixture: ComponentFixture<Checkout2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Checkout2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Checkout2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
