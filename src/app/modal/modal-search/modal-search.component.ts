import { Answer } from './../../models/Answer';
import { Quest } from './../../models/Quest';
import { Search } from './../../models/Search';
import { SearchService } from './../../services/search.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

declare interface MyAnswer{
  id: number;
  rate: number;
  note: string;
}

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  styleUrls: ['./modal-search.component.css']
})
export class ModalSearchComponent implements OnInit {

  rate: number = 0
  selectedIndex: number
  search: Search
  question: Quest[]
  answer: MyAnswer[] = []
  note: string
  armazenaNota: number[] = []

  @ViewChild('stepIndex') stepIndex
  @ViewChild('stepIcon') stepIcon

  constructor(
    private searchService: SearchService,
    private modal: MatDialog,
    private modalRef: MatDialogRef<ModalSearchComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  ) {  }

  ngOnInit(): void {
    this.getSearch()
    console.log('Question', this.question)
  }

  async getSearch() {
    await this.searchService.getById(this.data.idSearch).subscribe(
      success => {
        this.search = success
        this.question = success[0]['quests']
        console.log(this.search)
      }, error => {
        console.error(error)
      })
  }

  setRate(rate: number){
    this.rate = rate
    console.log(this.rate)
    //console.log('selectedIndex', this.selectedIndex)
  }

  setRateStep() {
    if(this.rate === 0){
      return 'Pergunta 1'
    } else {
      return `Nota: ${this.rate}`
    }
  }

  logar(item){
    //console.log('Logar: ', item)
  }

  montagemCorpo() {

    for (let i = 0; i < this.stepIndex.selectedIndex; i++) {
      console.log(this.stepIndex.selectedIndex)
      console.log('ID IN FOR: ', this.answer[i].id)

      if(this.answer[i].id === this.stepIndex.selectedIndex){

        this.answer[i].id = this.stepIndex.selectedIndex
        this.answer[i].rate = this.rate
        this.answer[i].note = this.note

        

        i++
      } else {
        let aux = {
          id: this.stepIndex.selectedIndex,
          rate: this.rate,
          note: this.note
        }

        
        this.answer.push(aux)
        return
      }
    }

    console.log(this.answer)

    this.rate = -1
    this.note = ''
  }

}
