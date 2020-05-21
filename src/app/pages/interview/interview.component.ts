import { Search } from '../../models/Search';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalFunctions } from '../../global';
import { UserService } from '../../services/user.service';
import { Interview } from '../../models/Interview';
import { InterviewService } from '../../services/interview.service';
import { SearchService } from '../../services/search.service';
import { City } from '../../models/City';
import { CityService } from '../../services/city.service';
import { ModalSearchComponent } from '../../modal/modal-interview/modal-interview.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-maps',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css']
})
export class MapsComponent implements OnInit {

  step: number = -1 //Iniciado em -1 pq é o único valor que não da nota
  name: string = '';
  searches: Search[] = [];
  cities: City[] = [];
  citySelected: City;
  interview: Interview;
  username: String = '';

  @ViewChild('idSearch') MatButtonToggleGroup

  constructor(
    private cityService: CityService,
    private searchService: SearchService,
    private interviewService: InterviewService,
    private userService: UserService,
    private modal: MatDialog,
    private globalFunc: GlobalFunctions,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.getSearch()
    this.getCity()
    this.getUser()
  }

  setStep(index: number) {
    this.step = index
  }

  getSearch() {
    this.searchService.get('active=1').subscribe(
      success => {
        this.searches = success
      }, error => {
        this.globalFunc.showNotification("Não foi possível carregar as pesquisas", 2)

        console.error(error)
      })
  }

  getCity() {
    this.cityService.get('active=1').subscribe(
      success => {
        this.cities = success
      }, error => {
        this.globalFunc.showNotification("Não foi possível carregar as cidades", 2)

        console.error(error)
      })
  }

  getUser() {
    const id: number = parseInt(window.sessionStorage.getItem('userId'))

    this.userService.getById(id).subscribe(
      success => {
        this.username = success['name']
      }, error => {
        console.error(error)
      })
  }

  openSearch(search: Search) {
    if (!this.name)
      this.snackBar.open('Preencha o nome do cliente', 'Fechar', { duration: 2000 });

    else if (!this.citySelected)
      this.snackBar.open('Preencha a cidade', 'Fechar', { duration: 2000 });

    else {
      const body = {
        client_name: this.name,
        city: this.citySelected,
        search_id: search.id
      }

      this.modal.open(ModalSearchComponent, {
        width: '93%',
        height: '89%',
        disableClose: true,
        autoFocus: true,
        data: {
          interview: body,
          user: this.username.substring(0, this.username.search(' ')),
          search_type: search.type,
          greetings: this.setGreetings()
        }
      })
    }
  }

  setGreetings() {
    var hours = new Date().getHours()

    if (hours >= 6 && hours < 12) {
      return `Bom dia`
    }
    if (hours >= 12 && hours < 18) {
      return `Boa tarde`
    }
    if (hours >= 18) {
      return `Boa noite`
    }
    else {
      return `<Bom dia, Boa tarde, Boa noite>`
    }
  }

}
