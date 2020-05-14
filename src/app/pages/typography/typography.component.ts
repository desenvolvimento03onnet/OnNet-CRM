import { HistoryAll } from './../../models/HistoryAll';
import { Interview } from './../../models/Interview';
import { InterviewService } from './../../services/interview.service';
import { MatSort } from '@angular/material/sort';
import { Answer } from './../../models/Answer';
import { AnswerService } from './../../services/answer.service';
import { GlobalFunctions } from './../../global';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';

declare interface Paginator{
  total: Number,
  perPage: Number,
  page: Number,
  lastPage: Number,
  data: Array<Object>
}

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css'],
})
export class TypographyComponent implements OnInit {

  @ViewChild('sortAnswer', { static: true }) private sortAnswer: MatSort

  answer: Answer[] = []
  filterAnswerValue: string = ''
  dataSourceAnswers = new MatTableDataSource([])
  displayedColumnsAnswer: string[] = ['search', 'name', 'question', 'rate', 'note', 'city', 'user', 'date']

  historyAll: HistoryAll[] = []
  filterSearchValue: string = ''
  dataSourceHistoryAll = new MatTableDataSource([])
  displayedColumnsHistoryAll: string[] = ['search', 'name', 'question', 'rate', 'note', 'city', 'user', 'date']

  type: string = 'client'

  minDate = new Date(2020, 4, 14)

  constructor(
    private answerService: AnswerService,
    private interviewService: InterviewService,
    private globalFunc: GlobalFunctions,
  ) { }

  async ngOnInit() {
    this.dataSourceAnswers.sort = this.sortAnswer
    this.getInterviewAll()
  }

  dateFilter

  logar(){
    const convert = this.globalFunc.dataConverter
    console.log(convert(this.dateFilter))
  }

  applyFilter(filterValue: string) {

    switch(this.type){
      case 'city':
        this.filterCity(filterValue)
        break;
      case 'client':
        this.filterClient(filterValue)
        break;
      case 'quest':
        this.filterQuest(filterValue)
        break;
      case 'note':
        this.filterNote(filterValue)
        break;
      case 'user':
        this.filterUser(filterValue)
        break;
      case 'search':
        this.filterDate(filterValue)
        break;
    }
    //this.dataSourceAnswers.filter = //filterValue.trim().toLowerCase()
  }

  setFilter(type: string){
    this.type = type
  }

  filterCity(value: string){
    const padronize = this.globalFunc.padronize

    this.dataSourceHistoryAll.data = this.historyAll.filter(function (historyAll) {
      return (padronize(historyAll.city).indexOf(value) != -1)
    })
  }

  filterClient(value: string){
    const padronize = this.globalFunc.padronize

    this.dataSourceHistoryAll.data = this.historyAll.filter(function (historyAll) {
      console.log(historyAll.updated_at)
      return (padronize(historyAll.client_name).indexOf(value) != -1)
    })
  }

  filterQuest(value: string){
    const padronize = this.globalFunc.padronize

    this.dataSourceHistoryAll.data = this.historyAll.filter(function (historyAll) {
      return (padronize(historyAll.question).indexOf(value) != -1)
    })
  }

  filterNote(value: string){
    const padronize = this.globalFunc.padronize

    this.dataSourceHistoryAll.data = this.historyAll.filter(function (historyAll) {
      return (padronize(historyAll.note).indexOf(value) != -1)
    })
  }

  filterUser(value: string){
    const padronize = this.globalFunc.padronize

    this.dataSourceHistoryAll.data = this.historyAll.filter(function (historyAll) {
      return (padronize(historyAll.user).indexOf(value) != -1)
    })
  }

  filterDate(value: string){
    const padronize = this.globalFunc.padronize

    this.dataSourceHistoryAll.data = this.historyAll.filter(function (historyAll) {
      return (padronize(historyAll.search).indexOf(value) != -1)
    })
  }

  getInterviewAll() {
    this.interviewService.getHisotry('/historic/all').subscribe(
      success => {
        this.historyAll = success['data']
        this.dataSourceHistoryAll.data = this.historyAll
        console.log(success['data'])
      }, error => {
        console.error(error)
      })
  }

  paginator: Paginator
  

}
