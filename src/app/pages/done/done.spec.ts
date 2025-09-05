import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneComponent } from './done';

describe('Done', () => {
  let component: DoneComponent;
  let fixture: ComponentFixture<DoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
