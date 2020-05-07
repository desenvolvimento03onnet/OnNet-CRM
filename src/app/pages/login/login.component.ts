import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

interface Login {
  username: String;
  password: String;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private passwordVisible: boolean = false;
  private typeInput: String = "password"

  private loginForm: FormGroup;
  private login: Login = {
    username: '',
    password: ''
  };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [this.login.username],
      password: [this.login.password],
    })
  }

  showPassword() {
    this.passwordVisible = !this.passwordVisible;

    if (this.passwordVisible)
      this.typeInput = "text";

    else
      this.typeInput = "password";
  }

  onSubmit() {
    const loginFormValue = this.loginForm.value;
    const rememberLogin: any = document.getElementById('remember')

    console.log(loginFormValue);
    console.log(rememberLogin.checked);
  }
}
