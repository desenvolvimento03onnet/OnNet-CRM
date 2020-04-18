import { ModalSearchComponent } from './../modal/modal-search/modal-search.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, OnDestroy{

  constructor(
      private modal: MatDialog,
  ) { }

  ngOnInit() {
    this.setTimer(this.date.getHours().toString())
  }

  ngOnDestroy(){
    this.setTimer(this.date.getHours().toString())
  }

  setTimer(hour: string){  

    if(parseInt(hour) >= 6 && parseInt(hour) < 12){
      this.timer = `Bom dia ${hour}`
    }
    else if(parseInt(hour) >= 12 && parseInt(hour) < 18){
      this.timer = `Boa tarde ${hour}`
    }
    else if(parseInt(hour) >= 18){
      this.timer = `Boa noite ${hour}`
    }

  }

  step: number = -1 //Iniciado em -1 pq é o único valor que não da nota
  name: string = 'Vinícius Gomes Correia'
  city: string = 'Patrocínio'
  nameUser: string = 'Vinícius'
  timer: string
  date = new Date

  setStep(index: number){
    this.step = index
  }

  openSearch(){

    if(this.name && this.city){
      this.modal.open(ModalSearchComponent, { 
          width : '1100px',
          height: '600px',
          disableClose: true,
          autoFocus: true,
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
