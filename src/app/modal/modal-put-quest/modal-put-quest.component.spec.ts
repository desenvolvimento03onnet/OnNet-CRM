import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPutQuestComponent } from './modal-put-quest.component';

describe('ModalPutQuestComponent', () => {
  let component: ModalPutQuestComponent;
  let fixture: ComponentFixture<ModalPutQuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPutQuestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPutQuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
