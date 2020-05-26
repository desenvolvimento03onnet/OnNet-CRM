import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InterviewService } from './../../services/interview.service';
import { GlobalFunctions } from './../../global';
import { DateAdapter } from '@angular/material/core';
import { UserService } from './../../services/user.service';
import { SearchService } from './../../services/search.service';
import { User } from './../../models/User';
import { Search } from './../../models/Search';
import { City } from './../../models/City';
import { CityService } from './../../services/city.service';
import { Component, OnInit, Inject } from '@angular/core';

interface Filter {
  client_name?: String;
  city?: City;
  search?: Search;
  user?: User;
  begin?: Date;
  end?: Date;
}

@Component({
  selector: 'app-modal-filter-interviews',
  templateUrl: './modal-filter-interviews.component.html',
  styleUrls: ['./modal-filter-interviews.component.css']
})
export class ModalFilterInterviewsComponent implements OnInit {

  private cities: City[] = [];
  private searches: Search[] = [];
  private users: User[] = [];

  filter: Filter = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private cityService: CityService,
    private searchService: SearchService,
    private userService: UserService,
    private interviewService: InterviewService,
    private functions: GlobalFunctions,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ModalFilterInterviewsComponent>,
    private adapter: DateAdapter<any>
  ) { }

  ngOnInit(): void {
    this.adapter.setLocale('pt');

    this.refreshCities();
    this.refreshSearches();

    if (sessionStorage.getItem('isMaster') == '1')
      this.refreshUsers();
  }

  refreshCities() {
    this.cityService.get().subscribe(
      cities => {
        this.cities = cities;
      },
      err => {
        console.log(err);
      })
  }

  refreshSearches() {
    this.searchService.get().subscribe(
      searches => {
        this.searches = searches;
      },
      err => {
        console.log(err);
      }
    )
  }

  refreshUsers() {
    this.userService.get().subscribe(
      users => {
        this.users = users;
      },
      err => {
        console.log(err);
      }
    )
  }

  setBeginDate(date: Date) {
    this.filter.begin = date;
  }

  setEndDate(date: Date) {
    this.filter.end = date;
  }

  async onSubmit() {
    const filterSubmit: {
      client_name?: String;
      city?: Number;
      search?: Number;
      user?: Number;
      begin?: String;
      end?: String;
    } = {};

    if (this.filter.client_name)
      filterSubmit.client_name = this.filter.client_name;

    if (this.filter.city)
      filterSubmit.city = this.filter.city.id;

    if (this.filter.search)
      filterSubmit.search = this.filter.search.id;

    if (this.filter.user)
      filterSubmit.user = this.filter.user.id;

    if (this.filter.begin)
      filterSubmit.begin = this.functions.dateConverter(this.filter.begin);

    if (this.filter.end)
      filterSubmit.end = this.functions.dateConverter(this.filter.end);

    if (JSON.stringify(filterSubmit) != '{}') {

      this.interviewService.getFiltered(filterSubmit, 'page=' + this.data.page).subscribe(
        suc => {
          this.dialogRef.close(Object.assign(suc, { filters: filterSubmit }))
        },
        err => {
          this.functions.showNotification("Ocorreu um erro durante busca", 3)

          console.log(err);
        })
    }
    else
      this.snackBar.open('Nenhum filtro aplicado', 'Fechar', { duration: 2000 })
  }

}
