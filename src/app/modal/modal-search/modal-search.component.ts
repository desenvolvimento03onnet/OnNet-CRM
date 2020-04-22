import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  styleUrls: ['./modal-search.component.css']
})
export class ModalSearchComponent implements OnInit {

  note: number = 0

  constructor(
    private modal: MatDialog,
    private modalRef: MatDialogRef<ModalSearchComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    console.log(data)
  }

  ngOnInit(): void {

  }

  setNote(note: number){
    this.note = note
    console.log(this.note)
  }

  setNoteStep(){
    if(this.note === 0){
      return 'Pergunta 1'
    } else {
      return `Nota: ${this.note}`
    }
  }

}
