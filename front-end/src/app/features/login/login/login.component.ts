import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicTacToeService } from '../../../shared/services/tic-tac-toe.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private ticTacToeService: TicTacToeService, private router: Router) { }

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required])
  });

  get username() { return this.loginForm.get("username") }

  onSubmit() {
    const { username } = this.loginForm.value;
    this.ticTacToeService.logIn(username).subscribe(res => {
        this.router.navigateByUrl('/lobby');
    });
  }

}
