import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPutUserComponent } from './modal-put-user.component';

describe('ModalPutUserComponent', () => {
  let component: ModalPutUserComponent;
  let fixture: ComponentFixture<ModalPutUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPutUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPutUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
