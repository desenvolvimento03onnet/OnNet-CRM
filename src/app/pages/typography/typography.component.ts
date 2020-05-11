import { Answer } from './../../models/Answer';
import { AnswerService } from './../../services/answer.service';
import { GlobalFunctions } from './../../global';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})
export class TypographyComponent implements OnInit {

  constructor(
    private answerService: AnswerService,
    private globalFunc: GlobalFunctions,
  ) { }

  ngOnInit() {
    this.getAnswers()
  }

  answer: Answer[] = []
  filterAnswerValue: string = ''
  dataSourceAnswers = new MatTableDataSource([])
  displayedColumns: string[] = ['search', 'name', 'question', 'rate', 'note', 'user', 'date']

  applyFilter(event: Event){
    const padronize = this.globalFunc.padronize

    const filterValue = padronize((event.target as HTMLInputElement).value)

    this.filterAnswerValue = filterValue
    this.dataSourceAnswers.data = this.answer.filter( function (answer) {
      return ((padronize(answer.interview.client_name).indexOf(filterValue) != -1))
    })
  }

  /*
        this.filterUsersValue = filterValue;

      this.dataSourceUsers.data = this.users.filter(function (user) {
        return ((padronize(user.name).indexOf(filterValue) != -1)
          || (padronize(user.username).indexOf(filterValue) != -1))
          && (user.active == active);
      })
  */

  getAnswers(){
    this.answerService.get().subscribe(
      answer => {
        this.dataSourceAnswers.data = answer
        console.log(this.dataSourceAnswers.data)
      }, error => {
        console.error(error)
      }
    )
  }

}
