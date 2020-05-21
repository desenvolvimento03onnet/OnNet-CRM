import { HistoryAll } from './../../models/HistoryAll';
import { InterviewService } from './../../services/interview.service';
import { MatSort } from '@angular/material/sort';
import { Answer } from './../../models/Answer';
import { GlobalFunctions } from './../../global';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatRadioButton } from '@angular/material/radio';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css'],
})
export class TypographyComponent implements OnInit {

  @ViewChild('sortAnswer', { static: true }) private sortAnswer: MatSort
  @ViewChild('sortCity', { static: true }) private sortCity: MatSort
  @ViewChild('paginatorAll') private paginatorAll: MatPaginator

  displayedColumnsAnswer: string[] = ['search', 'name', 'question', 'rate', 'note', 'city', 'user', 'date']
  dataSourceAnswers = new MatTableDataSource([])
  filterAnswerValue: string = ''
  answer: Answer[] = []

  displayedColumnsHistoryAll: string[] = ['search', 'name', 'question', 'rate', 'note', 'city', 'user', 'date']
  dataSourceHistoryAll = new MatTableDataSource([])
  filterSearchValue: string = ''
  historyAll: HistoryAll[] = []

  constructor(
    private interviewService: InterviewService,
    private globalFunc: GlobalFunctions,
  ) { }

  async ngOnInit() {
    this.getInterviewAll(1)
    this.getHistoryCity()
    await this.getPaginator()
    this.dataSourceHistoryAll.sort = this.sortAnswer
    this.dataSourceHistoryCity.sort = this.sortCity
    this.dataSourceHistoryAll.paginator = this.paginatorAll
  }

  dateFilter = new Date('')
  newDate = this.globalFunc.dateConverter(this.dateFilter)

  @ViewChild('cityActivyHistoryCity') cityActivyHistoryCity: MatRadioButton
  @ViewChild('searchActivyHistoryCity') searchActivyHistoryCity: MatRadioButton

  //#region Pesquisas Cidade

  displayedColumnsHistoryCity: string[] = ['search', 'city', 'avarage']
  dataSourceHistoryCity = new MatTableDataSource([])
  filterHistoryCityValue: string = ''
  historyCity: any

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

  @ViewChild('searchActivyHistorySearch') searchActivyHistorySearch: MatRadioButton
  @ViewChild('clientActivyHistorySearch') clientActivyHistorySearch: MatRadioButton
  @ViewChild('questActivyHistorySearch') questActivyHistorySearch: MatRadioButton
  @ViewChild('cityActivyHistorySearch') cityActivyHistorySearch: MatRadioButton
  @ViewChild('noteActivyHistorySearch') noteActivyHistorySearch: MatRadioButton
  @ViewChild('userActivyHistorySearch') userActivyHistorySearch: MatRadioButton

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

  logar() {
    const convert = this.globalFunc.dateConverter
    var newDate: string = convert(this.dateFilter)

    this.dataSourceHistoryAll.data = this.historyAll.filter(function (historyAll) {
      return (historyAll.updated_at.toString()).indexOf(newDate) != -1
    })
  }

  filterCitySearch(value: string) {
    const padronize = this.globalFunc.padronize
    const convert = this.globalFunc.dateConverter

    var newDate: string = convert(this.dateFilter)

    this.dataSourceHistoryAll.data = this.historyAll.filter(function (historyAll) {
      console.log(newDate)
      return ((padronize(historyAll.city).indexOf(value) != -1))
    })
  }

  filterClientSearch(value: string) {
    const padronize = this.globalFunc.padronize
    const convert = this.globalFunc.dateConverter

    var newDate: string = convert(this.dateFilter)

    if (newDate === 'NaN-NaN-NaN' || newDate === null) {
      this.dataSourceHistoryAll.data = this.historyAll.filter(function (historyAll) {
        return ((padronize(historyAll.client_name).indexOf(value) != -1))
      })
    } else {
      this.dataSourceHistoryAll.data = this.historyAll.filter(function (historyAll) {
        return ((padronize(historyAll.client_name).indexOf(value) != -1)
          || padronize(historyAll.updated_at.toString()).indexOf(newDate) != -1)
      })
    }
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

  getInterviewAll(page) {
    this.interviewService.getHisotry('/historic/all?page=' + page).subscribe(
      success => {
        this.historyAll = success['data']
        this.dataSourceHistoryAll.data = this.historyAll
        console.log(success['data'])
      }, error => {
        console.error(error)
      })
  }
  //#endregion

  //#region pagination

  //Nada daqui para baixo funciona
  lastPage: Number
  perPage: Number
  total: number
  page: Number

  async getPaginator() {
    await this.interviewService.getHisotry('/historic/all').subscribe(
      paginator => {
        this.lastPage = paginator['lastPage']
        this.perPage = paginator['perPage']
        this.total = paginator['total']
        this.page = paginator['page']
      }, error => {
        console.error(error)
      })
  }
  //#endregion

  getInterviewPerPage(page) {
    this.interviewService.getHisotry('/historic/all?page=' + page).subscribe(
      success => {
        this.dataSourceHistoryAll.data = success['data']
      }, error => {
        console.error(error)
      })
    return this.dataSourceHistoryAll.data
  }

  async pageEvent(event: MatPaginator) {
    console.log(event)
    if (event.pageSize == 120) {
      this.dataSourceHistoryAll.data = await this.getInterviewPerPage(event.pageIndex + 1)
      setTimeout(function (){
        this.paginatorAll.length = 150
      }, 7000)
    }
  }


  teste(){
    //this.dataSourceHistoryAll.data = await this.getInterviewPerPage(event.pageIndex + 1)
  }
}
