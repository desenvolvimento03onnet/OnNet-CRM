import { ModalSearchComponent } from './../modal/modal-search/modal-search.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  constructor(
      private modal: MatDialog,
  ) { }

  ngOnInit() { }

  step: number = -1
  name: string
  city: string

  setStep(index: number){
    this.step = index
  }

  openSearch(){
      this.modal.open(ModalSearchComponent, { 
          width : '800px',
          height: '600px',
          data: {
              name: this.name,
              city: this.city
          }
      })
  }
  
}
