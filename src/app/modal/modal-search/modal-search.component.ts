import { AnswerService } from './../../services/answer.service';
import { InterviewService } from './../../services/interview.service';
import { Answer } from './../../models/Answer';
import { Quest } from './../../models/Quest';
import { Search } from './../../models/Search';
import { SearchService } from './../../services/search.service';
import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  styleUrls: ['./modal-search.component.css']
})
export class ModalSearchComponent implements OnInit, OnDestroy {

  rate: number = 0
  rates = []
  selectedIndex: number
  search: Search
  question: Quest[]
  note: string = ''
  notes = []
  armazenaNota: number[] = []
  idInterview: number[] = []
  answer: Answer[]
  idAnswer = []

  body: Object = { 
    rate: Number, 
    note: String
  }

  @ViewChild('stepIndex') stepIndex
  @ViewChild('index') index
  
  constructor(
    private searchService: SearchService,
    private answerService: AnswerService,
    private interviewService: InterviewService,
    private modal: MatDialog,
    private modalRef: MatDialogRef<ModalSearchComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  ) {  }

  ngOnInit(): void {
    this.getSearch()
    this.getInterview()
    console.log('This.data: ', this.data)
  }

  ngOnDestroy() {
    //Não funfa
    this.data.name = ''
    this.data.city = ''
    this.data.greetings = ''
  }

  getSearch() {
    this.searchService.getById(this.data.idSearch).subscribe(success => {
      this.search = success;
      console.log('CU',this.search);
      this.question = success['quests'];
    }, error => {
      console.error(error);
    })
  }

  getInterview() {
    this.answerService.get('interview=' + this.data.interview.id).subscribe(success => {
      this.answer = success;
      console.log('Answer: ', this.answer);
      for (let i = 0; i < this.answer.length; i++) {
        this.idAnswer[i] = this.answer[i].id
        //this.notes[i] = null
        console.log(this.notes)
      }
    }, error => {
      console.error(error);
    })
  }

  send(stepper: MatStepper) {

    if(this.rates[stepper.selectedIndex]) {
      this.notes.push(this.note)
      this.rates.push(this.rate)

      for (let i = 0; i < this.answer.length; i++) {

        this.body = {
          rate: this.rates[i],
          note: this.notes[i]
        }

        this.answerService.put(this.idAnswer[i], this.body).subscribe(success => {
          console.log(success);
          if (i === this.idAnswer.length - 1) {
            this.interviewService.put(this.data.interview.id, {
              finished: 1
            }).subscribe(success => {
              console.log(success);
              this.modalRef.close();
              alert('Enviado com Sucesso');
            }, error => {
              alert('Falha \n Envio não realizado, contactar o administrador do sistema');
              console.error(error);
            });
          }
        }, error => {
          alert('Falha \n As respostas dessas perguntas não foram enviadas');
        })
      }
    } else {
      alert(`Insira uma Nota`)
    }
  }

  exit() {
    this.interviewService.delete(this.data.interview.id).subscribe(success => {
      alert('Pesquisa excluída com sucesso');
      this.modalRef.close();
    }, error => {
      alert('Ocorreu um erro na exclusão da pesquisa');
    })
  }

  setLabel(index) {
    if(this.rates[index] != undefined) {
      return `Nota: ${this.rates[index]}`
    } else {
      return `Pergunta`
    }
  }

  setNoteBody(stepper: MatStepper) {

      this.notes.fill(this.notes[stepper.selectedIndex], stepper.selectedIndex, stepper.selectedIndex + 1)

      console.log('this.notes', this.notes)

      if(this.rates[stepper.selectedIndex] != undefined){
        stepper.next()
      } else {
        alert('Insira uma nota')
      }

  }

  getNoteBody(stepper: MatStepper) {
    return this.notes[stepper.selectedIndex]
  }

  setRate(rate: number) {
    this.rate = rate
  }

  setRateBody(stepper: MatStepper) {
    if(this.rate != 0) {
      if(!this.rates[stepper.selectedIndex]){
        this.rates.push(this.rate)
        console.log(this.rates)
      }
      if(this.rates[stepper.selectedIndex]){
        this.rates.fill(this.rate, stepper.selectedIndex, stepper.selectedIndex + 1)
        console.log(this.rates)
      }
    }
    
    this.rate = 0
  }

  getRate(stepper: MatStepper){
    return this.rates[stepper.selectedIndex]
  }

}
