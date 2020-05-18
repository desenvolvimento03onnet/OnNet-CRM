import { HistoryCity } from './../../models/HistoryCity';
import { HistoryAll } from './../../models/HistoryAll';
import { InterviewService } from './../../services/interview.service';
import { MatSort } from '@angular/material/sort';
import { Answer } from './../../models/Answer';
import { AnswerService } from './../../services/answer.service';
import { GlobalFunctions } from './../../global';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatRadioButton } from '@angular/material/radio';

declare interface Paginator {
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
  @ViewChild('sortCity', { static: true }) private sortCity: MatSort

  answer: Answer[] = []
  filterAnswerValue: string = ''
  dataSourceAnswers = new MatTableDataSource([])
  displayedColumnsAnswer: string[] = ['search', 'name', 'question', 'rate', 'note', 'city', 'user', 'date']

  historyAll: HistoryAll[] = []
  filterSearchValue: string = ''
  dataSourceHistoryAll = new MatTableDataSource([])
  displayedColumnsHistoryAll: string[] = ['search', 'name', 'question', 'rate', 'note', 'city', 'user', 'date']

  minDate = new Date(2020, 4, 14)

  paginator: Paginator

  constructor(
    private answerService: AnswerService,
    private interviewService: InterviewService,
    private globalFunc: GlobalFunctions,
  ) { }

  async ngOnInit() {
    this.dataSourceHistoryAll.sort = this.sortAnswer
    this.dataSourceHistoryCity.sort = this.sortCity
    this.getInterviewAll()
    this.getHistoryCity()
  }
  dateFilter = new Date('')
  newDate = this.globalFunc.dataConverter(this.dateFilter)

  //#region Teste
  @ViewChild('cityActivyHistoryCity') cityActivyHistoryCity: MatRadioButton
  @ViewChild('searchActivyHistoryCity') searchActivyHistoryCity: MatRadioButton
  test() {
    console.log(this.cityActivyHistoryCity.checked)
  }
  //#endregion

  //#region Pesquisas Cidade

  historyCity: any
  filterHistoryCityValue: string = ''
  dataSourceHistoryCity = new MatTableDataSource([])
  displayedColumnsHistoryCity: string[] = ['search', 'city', 'avarage']

  selectFilterCity

  typeHistoryCity: string

  applyFilterCity(value: string) {
    const padronize = this.globalFunc.padronize
    const newValue = padronize(value)

    if (this.cityActivyHistoryCity.checked) {
      this.filterHistoryCity(newValue)
    }
    else if (this.searchActivyHistoryCity.checked) {
      this.filterHistorySearch(newValue)
    }
  }

  filterAll(valueFilter: string, data = new MatTableDataSource, historyCity: any, teste, arg) {
    const padronize = this.globalFunc.padronize
    const arr: any[] = []
    arr.push(historyCity)
    data.data = arr.filter(function (teste) {
      console.log(arg)
      return (padronize(arg).indexOf(valueFilter) != -1)
    })
  }

  filterHistoryCity(valueFilter: string) {
    const padronize = this.globalFunc.padronize

    this.dataSourceHistoryCity.data = this.historyCity.filter(function (historyCity) {
      return (padronize(historyCity.city).indexOf(valueFilter) != -1)
    })
  }

  filterHistorySearch(valueFilter: string) {
    const padronize = this.globalFunc.padronize

    this.dataSourceHistoryCity.data = this.historyCity.filter(function (historyCity) {
      return (padronize(historyCity.search).indexOf(valueFilter) != -1)
    })
  }

  getHistoryCity() {
    this.interviewService.getHisotry('/historic/avarage/city').subscribe(
      historyCity => {
        this.historyCity = historyCity
        this.dataSourceHistoryCity.data = this.historyCity
        console.log(this.historyCity)
      }, error => {
        console.error(error)
      })
  }

  //#endregion

  //#region Perguntas Geral

  @ViewChild('cityActivyHistorySearch') cityActivyHistorySearch: MatRadioButton
  @ViewChild('clientActivyHistorySearch') clientActivyHistorySearch: MatRadioButton
  @ViewChild('questActivyHistorySearch') questActivyHistorySearch: MatRadioButton
  @ViewChild('noteActivyHistorySearch') noteActivyHistorySearch: MatRadioButton
  @ViewChild('userActivyHistorySearch') userActivyHistorySearch: MatRadioButton
  @ViewChild('searchActivyHistorySearch') searchActivyHistorySearch: MatRadioButton

  applyFilterSearch(value: string) {
    const padronize = this.globalFunc.padronize
    const newValue = padronize(value)

    if (this.cityActivyHistorySearch.checked) {
      this.filterCitySearch(newValue)
    }
    else if (this.clientActivyHistorySearch.checked) {
      this.filterClientSearch(newValue)
    }
    else if (this.questActivyHistorySearch.checked) {
      this.filterQuestSearch(newValue)
    }
    else if (this.noteActivyHistorySearch.checked) {
      this.filterNoteSearch(newValue)
    }
    else if (this.userActivyHistorySearch.checked) {
      this.filterUserSearch(newValue)
    }
    else if (this.searchActivyHistorySearch.checked) {
      this.filterSearchSearch(newValue)
    }
  }

  filterCitySearch(value: string) {
    const padronize = this.globalFunc.padronize
    const convert = this.globalFunc.dataConverter

    var newDate: string = convert(this.dateFilter)

    this.dataSourceHistoryAll.data = this.historyAll.filter(function (historyAll) {
      console.log(newDate)
      return ((padronize(historyAll.city).indexOf(value) != -1))
    })
  }

  filterClientSearch(value: string) {
    const padronize = this.globalFunc.padronize
    const convert = this.globalFunc.dataConverter

    var newDate: string = convert(this.dateFilter)

    this.dataSourceHistoryAll.data = this.historyAll.filter(function (historyAll) {
      return ((padronize(historyAll.client_name).indexOf(value) != -1))
    })
  }

  filterQuestSearch(value: string) {
    const padronize = this.globalFunc.padronize

    this.dataSourceHistoryAll.data = this.historyAll.filter(function (historyAll) {
      return (padronize(historyAll.question).indexOf(value) != -1)
    })
  }

  filterNoteSearch(value: string) {
    const padronize = this.globalFunc.padronize

    this.dataSourceHistoryAll.data = this.historyAll.filter(function (historyAll) {
      return (padronize(historyAll.note).indexOf(value) != -1)
    })
  }

  filterUserSearch(value: string) {
    const padronize = this.globalFunc.padronize

    this.dataSourceHistoryAll.data = this.historyAll.filter(function (historyAll) {
      return (padronize(historyAll.user).indexOf(value) != -1)
    })
  }

  filterDateSearch(value: string) {
    const padronize = this.globalFunc.padronize

    this.dataSourceHistoryAll.data = this.historyAll.filter(function (historyAll) {
      return (padronize(historyAll.search).indexOf(value) != -1)
    })
  }

  filterSearchSearch(value: string) {
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
  //#endregion


}
