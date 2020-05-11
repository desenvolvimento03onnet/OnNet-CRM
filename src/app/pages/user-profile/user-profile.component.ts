import { User } from './../../models/User';
import { UserService } from './../../services/user.service';
import { Search } from './../../models/Search';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InterviewsCount } from './../../models/InterviewsCount';
import { Chart } from 'chart.js';
import { parseOptions, chartOptions, chartQuestions } from './../../variables/charts';
import { SearchService } from './../../services/search.service';
import { AnswerService } from './../../services/answer.service';
import { InterviewService } from './../../services/interview.service';
import { GlobalFunctions } from './../../global';
import { Component, OnInit, ViewChild } from '@angular/core';

interface DataChart {
  id: Number;
  quest: String;
  label: string;
  values: number[];
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @ViewChild('sortCity', { static: true }) private sortCity: MatSort;

  private displayedColumnsCity: string[] = ['name', 'count'];
  private dataSourceCity: MatTableDataSource<InterviewsCount>;
  private matCityLoading = true;
  private totalInterviews: Number = 0;

  private user: User = {
    id: 0,
    name: '',
    username: '',
    password: '',
    permission_id: 0,
    active: true,
    created_at: null,
    updated_at: null,
    permission: {
      id: 0,
      type: '',
      active: true,
      created_at: null,
      updated_at: null
    },
  };

  constructor(
    private userService: UserService,
    private interviewService: InterviewService,
  ) {

    parseOptions(Chart, chartOptions());
  }

  ngOnInit(): void {
    this.refresh();
  }

  async refresh() {
    this.refreshMatTables().then(() => {
      this.matCityLoading = false;
    });

    this.userService.getById(parseInt(sessionStorage.getItem('userId'))).subscribe(
      user => {
        this.user = user;
      },
      err => {
        console.log(err);
      }
    );
  }

  async refreshMatTables() {
    await this.loadMatTables();

    this.dataSourceCity.sort = this.sortCity;
  }

  async loadMatTables() {
    const userId = sessionStorage.getItem('userId');

    const dataCity = await this.interviewService.groupByCity('active=1', 'user=' + userId).toPromise();

    this.totalInterviews = dataCity.map(c => c.count).reduce((acc, value: any) => acc + value, 0);

    this.dataSourceCity = new MatTableDataSource(dataCity);
  }
}
