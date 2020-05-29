import { ModalInfoInterviewComponent } from '../../modal/modal-info-interview/modal-info-interview.component';
import { ModalFilterInterviewsComponent } from '../../modal/modal-filter-interviews/modal-filter-interviews.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalFunctions } from '../../global';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Interview } from '../../models/Interview';
import { InterviewService } from '../../services/interview.service';
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
  selector: 'app-register-interview',
  templateUrl: './register-interview.component.html',
  styleUrls: ['./register-interview.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TypographyComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) private sort: MatSort;

  private displayedColumns: String[] = ['client_name', 'search', 'city', 'user', 'interview_date', 'info'];
  private interviews: Interview[] = [];
  private filter: AdvancedSearch;
  private currentPage: number = 1;
  private dataSource: MatTableDataSource<Interview>;
  private filterValue: String;
  private filters: String[];
  private lastPage: Number = 1;

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
    this.refresh();
  }

  refresh() {
    this.functions.showLoading();

    this.interviewService.getFiltered(this.filter).subscribe(
      suc => {
        this.interviews = suc.data;

        this.dataSource = new MatTableDataSource(this.interviews);

        this.lastPage = suc.lastPage;

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'search': return item.search.type;
            case 'city': return item.city.name;
            case 'user': return item.user.name;
            default: return item[property];
          }
        }

        this.dataSource.sort = this.sort;

        this.functions.stopLoading();
      },
      err => {
        this.functions.stopLoading();

        this.functions.showNotification("Ocorreu um erro ao carregar as pesquisas", 3);

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
    }).beforeClosed().subscribe(filter => {
      if (filter) {
        this.dataSource.data = filter.data;

        this.filters = filter.filters;
      }
    })
  }

  clearFilters() {
    this.dataSource.data = this.interviews;

    this.filters = null;
  }

  nextPage() {
    if (this.currentPage < this.lastPage) {
      this.functions.showLoading();

      this.interviewService.getFiltered(this.filter, "page=" + (this.currentPage + 1)).subscribe(
        suc => {
          this.currentPage = suc.page;
          this.lastPage = suc.lastPage;

          this.interviews = this.interviews.concat(suc.data);

          this.dataSource.data = this.interviews;

          this.functions.stopLoading();
        },
        err => {
          this.functions.stopLoading();

          this.functions.showNotification("Ocorreu um erro ao carregar as pesquisas", 3);

          console.log(err);
        })
    }
  }

  infoInterview(interview: Interview) {
    this.dialog.open(ModalInfoInterviewComponent, {
      width: "1000px",
      height: "600px",
      data: interview
    });
  }

}
