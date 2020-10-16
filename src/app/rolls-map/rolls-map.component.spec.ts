import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollsMapComponent } from './rolls-map.component';

describe('RollsMapComponent', () => {
  let component: RollsMapComponent;
  let fixture: ComponentFixture<RollsMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollsMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
