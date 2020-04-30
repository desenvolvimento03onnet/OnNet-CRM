import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPutSearchComponent } from './modal-put-search.component';

describe('ModalPutSearchComponent', () => {
  let component: ModalPutSearchComponent;
  let fixture: ComponentFixture<ModalPutSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPutSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPutSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
