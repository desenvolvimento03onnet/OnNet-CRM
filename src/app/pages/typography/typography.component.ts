import { InterviewService } from './../../services/interview.service';
import { MatSort } from '@angular/material/sort';
import { Answer } from './../../models/Answer';
import { AnswerService } from './../../services/answer.service';
import { GlobalFunctions } from './../../global';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})
export class TypographyComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort

  answer: Answer[] = []
  filterAnswerValue: string = ''
  dataSourceAnswers = new MatTableDataSource([])
  displayedColumnsAnswer: string[] = ['search', 'name', 'question', 'rate', 'note', 'user', 'date']

  interview: any
  filterSearchValue: string = ''
  dataSourceInterview = new MatTableDataSource([])
  displayedColumnsSearch: string[] = ['search', 'average']

  constructor(
    private answerService: AnswerService,
    private interviewService: InterviewService,
    private globalFunc: GlobalFunctions,
  ) { }

  async ngOnInit() {
    this.getAnswers()
    this.dataSourceAnswers.sort = this.sort
  }

  applyFilter(event: Event) {
    const padronize = this.globalFunc.padronize
    const filterValue = padronize((event.target as HTMLInputElement).value)
    this.filterAnswerValue = filterValue

    console.log(this.answer)
    this.dataSourceAnswers.data = this.answer.filter(function (answer) {
      return (padronize(answer.note).indexOf(filterValue) != -1)
    })
  }

  /*
      const padronize = this.globalFunc.padronize;

      const filterValue = padronize((event.target as HTMLInputElement).value);
      const active = this.activeUsers;

      this.filterUsersValue = filterValue;

      this.dataSourceUsers.data = this.users.filter(function (user) {
        return ((padronize(user.name).indexOf(filterValue) != -1)
          || (padronize(user.username).indexOf(filterValue) != -1))
          && (user.active == active);
      })
  */

  getAnswers() {
    this.answerService.get().subscribe(
      answer => {
        this.answer = answer
        this.dataSourceAnswers.data = answer
      }, error => {
        console.error(error)
      })
  }

  getAnswer() {
    this.interviewService.get().subscribe(
      interview => {
        this.interview = interview
        this.dataSourceInterview.data = this.interview
        console.log(this.interview)
      }, error => {
        console.error(error)
      })
  }

}
