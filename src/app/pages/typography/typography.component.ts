import { ModalFilterInterviewsComponent } from './../../modal/modal-filter-interviews/modal-filter-interviews.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalFunctions } from './../../global';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Interview } from './../../models/Interview';
import { InterviewService } from './../../services/interview.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

interface AdvancedSearch {
  client_name?: String,
  begin?: String,
  end?: String,
  city?: Number,
  search?: Number,
  user?: Number
}

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TypographyComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) private sort: MatSort;

  private displayedColumns: String[] = ['client_name', 'search', 'city', 'user', 'interview_date', 'info'];
  private interviews: Interview[] = [];
  private filter: AdvancedSearch;
  private currentPage: Number = 1;
  private dataSource: MatTableDataSource<Interview>;
  private filterValue: String;

  constructor(
    private interviewService: InterviewService,
    private functions: GlobalFunctions,
    private dialog: MatDialog
  ) {
    this.filter = {
      client_name: null,
      begin: null,
      end: null,
      city: null,
      search: null,
      user: null
    }
  }

  ngOnInit() {
    this.openFilterInterview();

    this.interviewService.getFiltered(this.filter).subscribe(
      suc => {
        this.interviews = suc.data;

        this.dataSource = new MatTableDataSource(this.interviews);

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'search': return item.search.type;
            case 'city': return item.city.name;
            case 'user': return item.user.name;
            default: return item[property];
          }
        }

        this.dataSource.sort = this.sort;
      },
      err => {
        console.log(err);
      }
    )
  }

  applyFilter(value: String) {
    const padronize = this.functions.padronize;
    const filterValue = padronize(value);

    this.filterValue = value;

    this.dataSource.data = this.interviews.filter(function (interview) {
      return (padronize(interview.client_name).indexOf(filterValue) != -1)
        || (padronize(interview.city.name).indexOf(filterValue) != -1)
        || (padronize(interview.user.name).indexOf(filterValue) != -1)
    })
  }

  openFilterInterview() {
    this.dialog.open(ModalFilterInterviewsComponent, {
      width: "600px",
      height: "400px",
      data: {
        page: this.currentPage
      }
    }).beforeClosed().subscribe(filter => {
      console.log(filter);

      if (filter) {
        this.dataSource.data = filter.data;
      }
    })
  }

}
