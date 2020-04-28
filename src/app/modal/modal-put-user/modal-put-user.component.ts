import { UserService } from './../../services/user.service';
import { Permission } from './../../models/Permission';
import { PermissionService } from './../../services/permission.service';
import { User } from './../../models/User';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

export interface StoreUser {
  name: String;
  username: String;
  password: String;
  permission_id: Number;
  active: Boolean;
}

@Component({
  selector: 'app-modal-put-user',
  templateUrl: './modal-put-user.component.html',
  styleUrls: ['./modal-put-user.component.css']
})
export class ModalPutUserComponent implements OnInit {
  private permissions: Permission[]
  private userPermission: Number;
  private user: StoreUser;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: User,
    private dialogRef: MatDialogRef<ModalPutUserComponent>,
    private permissionService: PermissionService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.permissionService.get().subscribe(
      permissions => {
        this.permissions = permissions;
      },
      err => {
        console.log(err)
      });

    this.refreshUser();
  }

  refreshUser() {
    if (this.data) {
      this.user = {
        name: this.data.name,
        username: this.data.username,
        password: "",
        active: Boolean(this.data.active),
        permission_id: this.data.permission_id
      }
    }
    else {
      this.user = {
        name: "",
        username: "",
        password: "",
        active: true,
        permission_id: 0
      }
    }
  }

  changeActive(checked: Boolean) {
    this.user.active = checked;
  }

  onSubmit() {
    if (this.data)
      this.putUser();

    else
      this.postUser();
  }

  postUser() {
    if (!this.user.name || !this.user.username || !this.user.password || this.user.permission_id == 0)
      alert("Preencha todos os campos");
    else
      this.userService.post(this.user).subscribe(
        () => {
          this.dialogRef.close();
        },
        err => {
          console.log(err);
          this.dialogRef.close();
        }
      );
  }

  putUser() {
    const userSubmit = this.user;

    if (this.user.name == this.data.name)
      delete userSubmit.name;

    if (this.user.username == this.data.username)
      delete userSubmit.username

    if (!this.user.password)
      delete userSubmit.password

    if (this.user.permission_id == this.data.permission_id)
      delete userSubmit.permission_id

    if (this.user.active == Boolean(this.data.active))
      delete userSubmit.active

    this.userService.put(this.data.id, userSubmit).subscribe(
      () => {
        this.dialogRef.close();
      },
      err => {
        console.log(err)
        this.dialogRef.close();
      }
    );
  }
}
