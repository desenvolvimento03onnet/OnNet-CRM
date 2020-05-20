import { GlobalFunctions } from './../../global';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './../../services/user.service';
import { Permission } from './../../models/Permission';
import { PermissionService } from './../../services/permission.service';
import { User } from './../../models/User';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

interface StoreUser {
  name?: String;
  username?: String;
  password?: String;
  permission_id?: Number;
  active?: Boolean;
}

@Component({
  selector: 'app-modal-put-user',
  templateUrl: './modal-put-user.component.html',
  styleUrls: ['./modal-put-user.component.css']
})
export class ModalPutUserComponent implements OnInit {
  private permissions: Permission[]
  private user: StoreUser;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: User,
    private dialogRef: MatDialogRef<ModalPutUserComponent>,
    private permissionService: PermissionService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private functions: GlobalFunctions
  ) { }

  ngOnInit(): void {
    this.permissionService.get().subscribe(
      permissions => {
        this.permissions = permissions;
      },
      err => {
        this.functions.showNotification("Não foi possível carregar as permissões", 2)

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

  async postUser() {
    if (!this.user.name || !this.user.username || !this.user.password || this.user.permission_id == 0)
      this.snackBar.open('Preencha todos os campos', 'Fechar', { duration: 2000 });

    else {
      const close: boolean = await this.functions.confirm("Confirmar criação do usuário?", {
        width: "350px"
      })

      if (close === true)
        this.userService.post(this.user).subscribe(
          () => {
            this.functions.showNotification("Usuário criado com sucesso!", 1)

            this.dialogRef.close();
          },
          err => {
            this.functions.showNotification("Ocorreu um erro durante a criação", 3)

            console.log(err);
          }
        );
    }
  }

  async putUser() {
    const userSubmit: StoreUser = {};

    if (this.user.name != this.data.name)
      userSubmit.name = this.user.name;

    if (this.user.username != this.data.username)
      userSubmit.username = this.user.username;

    if (this.user.password)
      userSubmit.password = this.user.password;

    if (this.user.permission_id != this.data.permission_id)
      userSubmit.permission_id = this.user.permission_id;

    if (this.user.active != Boolean(this.data.active))
      userSubmit.active = this.user.active;

    if (JSON.stringify(userSubmit) != '{}') {
      const close: boolean = await this.functions.confirm("Confirmar alteração do usuário?", {
        width: "350px"
      })

      if (close === true)
        this.userService.put(this.data.id, userSubmit).subscribe(
          () => {
            this.functions.showNotification("Usuário alterado com sucesso!", 1)

            this.dialogRef.close();
          },
          err => {
            console.log(err)
            this.functions.showNotification("Ocorreu um erro durante a alteração", 3)
          }
        );
    }
    else
      this.snackBar.open('Nenhuma alteração realizada', 'Fechar', { duration: 2000 })
  }
}