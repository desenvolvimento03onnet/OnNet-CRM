import { GlobalFunctions } from './../../global';
import { Search } from './../../models/Search';
import { SearchService } from './../../services/search.service';
import { DateAdapter } from '@angular/material/core';
import { User } from './../../models/User';
import { UserService } from './../../services/user.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InterviewsCount } from './../../models/InterviewsCount';
import { InterviewService } from './../../services/interview.service';
import { Component, OnInit, ViewChild } from '@angular/core';

interface DataMatTable {
  data: InterviewsCount[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<InterviewsCount>;
  total: number;
  loading: boolean;
  filters: {
    search: Search;
    beginDate: Date;
    endDate: Date;
  }
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @ViewChild('sortCity', { static: true }) private sortCity: MatSort;

  private matTable: DataMatTable = {} as DataMatTable;
  
  private user: User = { permission: {} } as User;
  private searches: Search[] = [];

  constructor(
    private userService: UserService,
    private searchService: SearchService,
    private interviewService: InterviewService,
    private functions: GlobalFunctions,
    private adapter: DateAdapter<any>
  ) {
    this.matTable = {
      data: [],
      dataSource: new MatTableDataSource([]),
      displayedColumns: ['name', 'count'],
      total: 0,
      loading: true,
      filters: {
        search: null,
        beginDate: null,
        endDate: null
      }
    }
  }

  ngOnInit(): void {
    this.adapter.setLocale('pt');

    this.refresh();
  }

  async refresh() {
    this.refreshSearches();

    this.refreshMatTable();

    this.refreshUser();
  }

  refreshMatTable(params?: string) {
    const userId = sessionStorage.getItem('userId');

    this.interviewService.groupByCity(`active=1&user=${userId}`, params).subscribe(
      data => {
        this.matTable.data = data;
        this.matTable.dataSource.data = data;
        this.matTable.dataSource.sort = this.sortCity;

        this.matTable.total = this.matTable.data
          .map(c => c.count).reduce((acc, value: any) => acc + value, 0);

        this.matTable.loading = false;
      },
      err => {
        this.matTable.loading = false;

        console.log(err);
      }
    )
  }

  refreshUser() {
    this.userService.getById(parseInt(sessionStorage.getItem('userId'))).subscribe(
      user => {
        this.user = user;
      },
      err => {
        console.log(err);
      }
    );
  }

  refreshSearches() {
    this.searchService.get().subscribe(
      suc => {
        this.searches = suc;
      },
      err => {
        console.log(err);
      }
    );
  }

  filterMatTable() {
    const toDate = this.functions.dateConverter;
    var params: string = "";

    if (this.matTable.filters.search)
      params += "search=" + this.matTable.filters.search.id + "&";

    if (this.matTable.filters.beginDate)
      params += "begin=" + toDate(this.matTable.filters.beginDate) + "&";

    if (this.matTable.filters.endDate)
      params += "end=" + toDate(this.matTable.filters.endDate) + "&";

    if (params)
      params = params.slice(0, -1);

    this.refreshMatTable(params);
  }
}
