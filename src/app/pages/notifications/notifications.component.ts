import { ModalPutUserComponent } from './../../modal/modal-put-user/modal-put-user.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalFunctions } from './../../global';
import { CityService } from './../../services/city.service';
import { City } from './../../models/City';
import { QuestService } from './../../services/quest.service';
import { Quest } from './../../models/Quest';
import { SearchService } from './../../services/search.service';
import { Search } from './../../models/Search';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from './../../services/user.service';
import { User } from './../../models/User';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationsComponent implements OnInit {

  //user tab
  private displayedColumnsUsers: String[] = ['name', 'username', 'status', 'edit']
  private users: User[] = [];
  private dataSourceUsers = new MatTableDataSource([]);
  private activeUsers: boolean = true;
  private filterUsersValue: string = "";

  //search tab
  private searches: Search[] = [];
  private dataSourceSearches: Search[] = []
  private activeSearches: boolean = true;
  private filterSearchesValue: string = "";

  //quest tab
  private quests: Quest[] = [];
  private dataSourceQuests: Quest[] = [];
  private activeQuests: boolean = true;
  private filterQuestsValue: string = "";

  //city tab
  private displayedColumnsCities: String[] = ['name', 'username', 'status', 'edit'];
  private cities: City[] = [];
  private dataSourceCities = new MatTableDataSource([]);
  private activeCities: boolean = true;
  private filterCitiesValue: string = "";

  constructor(
    private userService: UserService,
    private searchService: SearchService,
    private questService: QuestService,
    private cityService: CityService,
    private globalFunc: GlobalFunctions,
    private modal: MatDialog
  ) { }

  async ngOnInit() {
    this.refreshUsers();
    this.refreshSearches();
    this.refreshQuests();
    this.refreshCities();
  }

  refreshUsers() {
    this.userService.get().subscribe(
      users => {
        this.users = users;
        this.applyFilterUserActive(this.activeUsers);
      },
      err => {
        console.log(err);
      });
  }

  refreshSearches() {
    this.searchService.get().subscribe(
      searches => {
        this.searches = searches;
        this.applyFilterSearchActive(this.activeSearches);
      },
      err => {
        console.log(err)
      });
  }

  refreshQuests() {
    this.questService.get().subscribe(
      quests => {
        this.quests = quests;
        this.applyFilterQuestActive(this.activeQuests);
      },
      err => {
        console.log(err);
      }
    )
  }

  refreshCities() {
    this.cityService.get().subscribe(
      cities => {
        this.cities = cities;
        this.applyFilterCityActive(this.activeCities);
      }
    )
  }

  applyFilterUser(event: Event) {
    if (this.users.length > 0) {
      const padronize = this.globalFunc.padronize;

      const filterValue = padronize((event.target as HTMLInputElement).value);
      const active = this.activeUsers;

      this.filterUsersValue = filterValue;

      this.dataSourceUsers.data = this.users.filter(function (user) {
        return ((padronize(user.name).indexOf(filterValue) != -1)
          || (padronize(user.username).indexOf(filterValue) != -1))
          && (user.active == active);
      })
    }
  }

  applyFilterSearch(event: Event) {
    if (this.searches.length > 0) {
      const padronize = this.globalFunc.padronize;

      const filterValue = padronize((event.target as HTMLInputElement).value);
      const active = this.activeSearches;

      this.filterSearchesValue = filterValue;

      this.dataSourceSearches = this.searches.filter(function (search) {
        return (padronize(search.type).indexOf(filterValue) != -1)
          && (search.active == active);
      })
    }
  }

  applyFilterQuest(event: Event) {
    if (this.quests.length > 0) {
      const padronize = this.globalFunc.padronize;

      const filterValue = padronize((event.target as HTMLInputElement).value);
      const active = this.activeQuests;

      this.filterQuestsValue = filterValue;

      this.dataSourceQuests = this.quests.filter(function (quest) {
        return (padronize(quest.question).indexOf(filterValue) != -1)
          && (quest.active == active);
      })
    }
  }

  applyFilterCity(event: Event) {
    if (this.cities.length > 0) {
      const padronize = this.globalFunc.padronize;

      const filterValue = padronize((event.target as HTMLInputElement).value);
      const active = this.activeCities;

      this.filterCitiesValue = filterValue;

      this.dataSourceCities.data = this.cities.filter(function (city) {
        return ((padronize(city.name).indexOf(filterValue) != -1)
          || padronize(city.user.username).indexOf(filterValue) != -1)
          && (city.active == active);
      })
    }
  }

  applyFilterUserActive(active: boolean) {
    if (this.users.length > 0) {
      const padronize = this.globalFunc.padronize;
      const filterValue = this.filterUsersValue;

      this.activeUsers = active;

      this.dataSourceUsers.data = this.users.filter(function (user) {
        return ((padronize(user.name).indexOf(filterValue) != -1)
          || (padronize(user.username).indexOf(filterValue) != -1))
          && (user.active == active);
      })
    }
  }

  applyFilterSearchActive(active: boolean) {
    if (this.searches.length > 0) {
      const padronize = this.globalFunc.padronize;
      const filterValue = this.filterSearchesValue;

      this.activeSearches = active;

      this.dataSourceSearches = this.searches.filter(function (search) {
        return (padronize(search.type).indexOf(filterValue) != -1)
          && (search.active == active);
      })
    }
  }

  applyFilterQuestActive(active: boolean) {
    if (this.quests.length > 0) {
      const padronize = this.globalFunc.padronize;
      const filterValue = this.filterQuestsValue;

      this.activeQuests = active;

      this.dataSourceQuests = this.quests.filter(function (quest) {
        return (padronize(quest.question).indexOf(filterValue) != -1)
          && (quest.active == active);
      })
    }
  }

  applyFilterCityActive(active: boolean) {
    if (this.cities.length > 0) {
      const padronize = this.globalFunc.padronize;
      const filterValue = this.filterCitiesValue;

      this.activeCities = active;

      this.dataSourceCities.data = this.cities.filter(function (city) {
        return ((padronize(city.name).indexOf(filterValue) != -1)
          || (padronize(city.user.username).indexOf(filterValue)) != -1)
          && (city.active == active)
      })
    }
  }

  storeUser(user: User) {
    this.modal.open(ModalPutUserComponent, {
      width: '800px',
      height: '600px',
      // disableClose: true,
      autoFocus: true,
      data: user
    }).beforeClosed().subscribe(() => {
      this.refreshUsers();
    })
  }
}
