import { UserService } from './../services/user.service';
import { Interview } from './../models/Interview';
import { InterviewService } from './../services/interview.service';
import { SearchService } from './../services/search.service';
import { City } from './../models/City';
import { CityService } from './../services/city.service';
import { ModalSearchComponent } from './../modal/modal-search/modal-search.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  step: number = -1 //Iniciado em -1 pq é o único valor que não da nota
  name: string = ''
  search: Object[]
  city: Object[]
  citySelected: City
  interview: Interview
  username: String = ''

  @ViewChild('idSearch') MatButtonToggleGroup

  constructor(
    private cityService: CityService,
    private searchService: SearchService,
    private interviewService: InterviewService,
    private userService: UserService,
    private modal: MatDialog,
  ) { }

  ngOnInit() {
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
        this.search = success
      }, error => {
        console.error(error)
      })
  }

  async getCity() {
    await this.cityService.get('active=1').subscribe(
      success => {
        this.city = success
        console.log(this.city)
      }, error => {
        console.error(error)
      })
  }

  openSearch(searchId: number) {
    if (this.name && this.citySelected) {

      const body = {
        client_name: this.name,
        interview_date: '2020-04-30',
        city_id: this.citySelected.id,
        search_id: searchId
      }

      //Criar Interview
      this.interviewService.post(body).subscribe(
        success => {
          this.interview = success

          this.modal.open(ModalSearchComponent, {
            width: '93%',
            height: '89%',
            disableClose: true,
            autoFocus: true,
            data: {
              name: this.name,
              city: this.citySelected,
              greetings: this.setGreetings(),
              user: this.username.substring(0, this.username.search(' ')),
              idSearch: searchId,
              interview: this.interview
            }
          }).beforeClosed().subscribe(() => {
            this.interviewService.put(success.id, { finished: true });
          })

        }, error => {
          console.error('Error', error)
        })
    }

    else {
      alert('Insira o valor correto')
    }
  }

  getUser() {
    const id:number = parseInt(window.sessionStorage.getItem('userId'))

    this.userService.getById(id).subscribe(
      success => {
        this.username = success['name']
      }, error => {
        console.error(error)
      })
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
