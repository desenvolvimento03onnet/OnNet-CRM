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

  constructor(
    private userService: UserService,
    private searchService: SearchService,
    private questService: QuestService
  ) { }

  async ngOnInit() {
    this.refreshUsers();
    this.refreshSearches();
    this.refreshQuests();
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

  applyFilterUser(event: Event) {
    if (this.users.length > 0) {
      const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
      const active = this.activeUsers;

      this.filterUsersValue = filterValue;

      this.dataSourceUsers.data = this.users.filter(function (user) {
        return ((user.name.toLowerCase().indexOf(filterValue) != -1)
          || (user.username.toLowerCase().indexOf(filterValue) != -1))
          && (user.active == active);
      })
    }
  }

  applyFilterUserActive(active: boolean) {
    if (this.users.length > 0) {
      const filterValue = this.filterUsersValue;

      this.activeUsers = active;

      this.dataSourceUsers.data = this.users.filter(function (user) {
        return ((user.name.toLowerCase().indexOf(filterValue) != -1)
          || (user.username.toLowerCase().indexOf(filterValue) != -1))
          && (user.active == active);
      })
    }
  }

  applyFilterSearch(event: Event) {
    if (this.searches.length > 0) {
      const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
      const active = this.activeSearches;

      this.filterSearchesValue = filterValue;

      this.dataSourceSearches = this.searches.filter(function (search) {
        return (search.type.toLowerCase().indexOf(filterValue) != -1)
          && (search.active == active);
      })
    }
  }

  applyFilterSearchActive(active: boolean) {
    if (this.searches.length > 0) {
      const filterValue = this.filterSearchesValue;

      this.activeSearches = active;

      this.dataSourceSearches = this.searches.filter(function (search) {
        return (search.type.toLowerCase().indexOf(filterValue) != -1)
          && (search.active == active);
      })
    }
  }

  applyFilterQuest(event) {
    if (this.quests.length > 0) {
      const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
      const active = this.activeQuests;

      this.filterQuestsValue = filterValue;

      this.dataSourceQuests = this.quests.filter(function (quest) {
        return (quest.question.toLowerCase().indexOf(filterValue) != -1)
          && (quest.active == active);
      })
    }
  }

  applyFilterQuestActive(active: boolean) {
    if (this.quests.length > 0) {
      const filterValue = this.filterQuestsValue;

      this.activeQuests = active;

      this.dataSourceQuests = this.quests.filter(function (quest) {
        return (quest.question.toLowerCase().indexOf(filterValue) != -1)
          && (quest.active == active);
      })
    }
  }
}
