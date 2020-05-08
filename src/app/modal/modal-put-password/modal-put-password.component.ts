import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

interface ChangePassword {
  currentPasswd: String;
  newPasswd: String;
  confirmPasswd: String;
}

@Component({
  selector: 'app-modal-put-password',
  templateUrl: './modal-put-password.component.html',
  styleUrls: ['./modal-put-password.component.css']
})
export class ModalPutPasswordComponent implements OnInit {

  private passwdForm: FormGroup;

  private passwd: ChangePassword = {
    currentPasswd: '',
    newPasswd: '',
    confirmPasswd: ''
  }

  constructor(private userService: UserService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.passwdForm = this.formBuilder.group({
      currentPasswd: [this.passwd.currentPasswd],
      newPasswd: [this.passwd.newPasswd],
      confirmPasswd: [this.passwd.confirmPasswd]
    })
  }

  async onSubmit() {
    const user = await this.userService.getById(parseInt(sessionStorage.getItem('userId'))).toPromise();

    this.userService.put(user.id, { password: '123mudar' }).subscribe(
      suc => {
        console.log(suc)
        alert('Senha alterada');
      },
      err => {
        console.log(err);
      }
    );
  }

  getUserId() {
  }

}
