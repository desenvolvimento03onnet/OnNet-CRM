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

  private displayedColumnsUsers: String[] = ['name', 'username', 'status', 'edit']
  private users: User[] = [];
  private dataSourceUsers;

  private activeUsers: boolean = true;
  private filterUsersValue: string = "";

  constructor(private userService: UserService) { }

  async ngOnInit() {
    this.refreshUsers().then(
      () => {
        this.dataSourceUsers = new MatTableDataSource(this.users);
      },
      err => {
        console.log(err);
      }
    );
  }

  async refreshUsers() {
    this.users = await this.userService.get().toPromise();

    this.dataSourceUsers = new MatTableDataSource(this.users);
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
}
