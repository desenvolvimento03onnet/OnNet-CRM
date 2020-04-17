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

  step: number = -1 //Iniciado em -1 pq é o único valor que não da nota
  name: string = 'Vinícius Gomes Correia'
  city: string = 'Patrocínio'

  setStep(index: number){
    this.step = index
  }

  openSearch(){

    if(this.name && this.city){
      this.modal.open(ModalSearchComponent, { 
          width : '1100px',
          height: '600px',
          data: {
              name: this.name,
              city: this.city
          }
      })
    }
    else{
      alert('Insira o valor correto')
    }
  }
  
}
