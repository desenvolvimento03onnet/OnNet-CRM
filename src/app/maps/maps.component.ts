import { ModalSearchComponent } from './../modal/modal-search/modal-search.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit{

  step: number = -1 //Iniciado em -1 pq é o único valor que não da nota
  name: string = 'Vinícius Gomes Correia'
  city: string = 'Patrocínio'
  greetings: string = ''
  hours = new Date().getHours()

  constructor(
    private modal: MatDialog,
  ) { }

  ngOnInit() {

  }

  setStep(index: number){
    this.step = index
  }

  openSearch(){
    if(this.name && this.city){
      this.modal.open(ModalSearchComponent, { 
          width : '93%',
          height: '89%',
          disableClose: true,
          autoFocus: true,
          data: {
              name: this.name,
              city: this.city,
              greetings: this.setGreetings(),
              user: 'Vinícius'
          }
      })
    }
    else{
      alert('Insira o valor correto')
    }
  }

  setGreetings(){

    var hours = new Date().getHours()

    if(hours >= 6 && hours < 12){
      this.greetings = `Bom dia ${hours}`
      console.log(hours)
      return `Bom dia ${hours}`
    } 
    if (hours >= 12 && hours < 18) {
      this.greetings = `Boa tarde ${hours}`
      console.log(hours)
      return `Boa tarde ${hours}`
    }
    if (hours >= 18){
      this.greetings = `Boa noite ${hours}`
      console.log(hours)
      return `Boa noite ${hours}`
    }
    else {
      console.log(hours)
      return `<Bom dia, Boa tarde, Boa noite>`
    }
  }

}
