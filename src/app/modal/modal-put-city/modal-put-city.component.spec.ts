import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPutCityComponent } from './modal-put-city.component';

describe('ModalPutCityComponent', () => {
  let component: ModalPutCityComponent;
  let fixture: ComponentFixture<ModalPutCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPutCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPutCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
